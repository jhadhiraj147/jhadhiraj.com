#!/usr/bin/env node
import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseEnv } from "node:util";

export const REDIRECT_URI = "http://127.0.0.1:4381/spotify/callback";
export const SETUP_URI = "http://127.0.0.1:4381/";

/** Reject rebinding hosts, cross-origin fetches and proxy-style request targets. */
export function parseSpotifySetupRequest(request) {
  if (request.headers.host !== "127.0.0.1:4381" ||
      (request.headers.origin !== undefined && request.headers.origin !== "http://127.0.0.1:4381")) return null;
  const target = request.url || "/";
  if (!target.startsWith("/") || target.startsWith("//") || /[\\\x00-\x20\x7f]/.test(target)) return null;
  try {
    const url = new URL(target, SETUP_URI);
    return url.origin === "http://127.0.0.1:4381" ? url : null;
  } catch { return null; }
}

/** Local instructions only: authorization state and app credentials stay on the server. */
export function renderSpotifySetupPage() {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connect Spotify to Beats</title>
<h1>Connect Spotify to Beats</h1>
<ol>
  <li>Open your app in the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer">Spotify Developer Dashboard</a>.</li>
  <li>In Settings, add this exact Redirect URI and save. Keep your existing website URI:<pre>${REDIRECT_URI}</pre></li>
  <li>Once saved, <a href="/authorize">connect your Spotify account</a> and approve read access to recent listening history.</li>
</ol>
<p>The connection is saved privately on this computer. No app secret or token is shown here.</p>
<p>This page expires after ten minutes. If necessary, run <code>node scripts/connect-spotify.mjs</code> again.</p>
<p><a href="http://localhost:3000">Return to the portfolio</a>, then type <code>beats</code> at its prompt.</p>
</html>`;
}

export function spotifyAuthorizationUrl(clientId, state) {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    response_type: "code", client_id: clientId,
    redirect_uri: REDIRECT_URI, scope: "user-read-recently-played", state,
  }).toString();
  return url.toString();
}

export function validSpotifyState(actual, expected) {
  if (typeof actual !== "string" || typeof expected !== "string") return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && left.length > 0 && timingSafeEqual(left, right);
}

export async function saveSpotifyRefreshToken(envPath, token) {
  if (typeof token !== "string" || !token || /[\r\n\0]/.test(token)) throw new Error("Invalid refresh token");
  let current = "";
  try { current = await readFile(envPath, "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const line = `SPOTIFY_REFRESH_TOKEN=${JSON.stringify(token)}`;
  const pattern = /^\s*(?:export\s+)?SPOTIFY_REFRESH_TOKEN\s*=.*$/gm;
  let added = false;
  const cleaned = current.replace(pattern, () => { if (added) return ""; added = true; return line; });
  const next = added ? cleaned : `${current}${current.endsWith("\n") || !current ? "" : "\n"}${line}\n`;
  // Rename a private complete file atomically; never truncate the live settings.
  const temporaryPath = `${envPath}.spotify-${randomBytes(12).toString("hex")}.tmp`;
  try {
    await writeFile(temporaryPath, next, { mode: 0o600, flag: "wx" });
    await rename(temporaryPath, envPath);
  } finally { await rm(temporaryPath, { force: true }); }
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Connect the portfolio owner's Spotify account. Requires Node 22.18+.");
    console.log("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
    console.log(`Register this redirect URI in Spotify: ${REDIRECT_URI}`);
    console.log("Run: node scripts/connect-spotify.mjs");
    console.log(`Then open the local connection page: ${SETUP_URI}`);
    console.log("The refresh token is saved to ignored .env.local and never printed.");
    return;
  }
  const envPath = resolve(process.cwd(), ".env.local");
  let localEnv = {};
  try { localEnv = parseEnv(await readFile(envPath, "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw new Error("Could not read .env.local"); }
  const clientId = process.env.SPOTIFY_CLIENT_ID || localEnv.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || localEnv.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local, then run this command again. See docs/spotify-beats.md.");
  }

  const state = randomBytes(32).toString("hex");
  let accepting = true;
  const server = createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Content-Security-Policy", "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    const url = parseSpotifySetupRequest(request);
    if (!url) {
      response.writeHead(403).end("Use the connection page at http://127.0.0.1:4381/ on this computer."); return;
    }
    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET" }).end("Method not allowed"); return;
    }
    if (url.pathname === "/") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(renderSpotifySetupPage()); return;
    }
    if (url.pathname === "/authorize") {
      if (!accepting) { response.writeHead(409).end("Authorization is already being processed."); return; }
      response.writeHead(302, { Location: spotifyAuthorizationUrl(clientId, state) }).end(); return;
    }
    if (url.pathname !== "/spotify/callback") {
      response.writeHead(404).end("Not found"); return;
    }
    if (!validSpotifyState(url.searchParams.get("state"), state)) {
      response.writeHead(400).end("Invalid authorization state. Use the original Spotify sign-in link."); return;
    }
    if (!accepting) { response.writeHead(409).end("Authorization is already being processed."); return; }
    accepting = false;
    const code = url.searchParams.get("code");
    if (url.searchParams.has("error") || !code) {
      response.writeHead(400).end("Spotify connection was not authorized. You can close this tab and try again.");
      console.error("Spotify connection was not authorized.");
      finish(1); return;
    }
    try {
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
        signal: AbortSignal.timeout(10000),
      });
      if (!tokenResponse.ok) throw new Error("Spotify did not accept the authorization code");
      const token = await tokenResponse.json();
      if (typeof token.scope !== "string" || !token.scope.split(" ").includes("user-read-recently-played")) {
        throw new Error("Listening-history permission was not granted");
      }
      await saveSpotifyRefreshToken(envPath, token.refresh_token);
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(
        "<!doctype html><html lang='en'><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Spotify connected</title><h1>Spotify connected.</h1><p>You can close this tab and refresh your portfolio.</p><p><a href='http://localhost:3000'>Return to the portfolio</a>, then type <code>beats</code> at its prompt.</p></html>",
      );
      console.log("Spotify connected. Refresh token saved privately in .env.local; no token was printed.");
      console.log("Refresh the portfolio. Restart its dev server if the connection does not appear.");
      finish(0);
    } catch {
      response.writeHead(502).end("Spotify could not be connected. Check the app credentials and registered redirect URI, then retry.");
      console.error("Spotify connection failed. Check the credentials and redirect URI; see docs/spotify-beats.md.");
      finish(1);
    }
  });
  server.headersTimeout = 10_000;
  server.requestTimeout = 15_000;
  server.keepAliveTimeout = 1000;
  const timeout = setTimeout(() => {
    console.error("Spotify authorization timed out. Run the command again when ready.");
    finish(1);
  }, 10 * 60 * 1000);
  const finish = (code) => { clearTimeout(timeout); server.close(); process.exitCode = code; };
  server.on("error", () => {
    clearTimeout(timeout);
    console.error("Could not start the Spotify connection helper on 127.0.0.1:4381. Check whether that port is already in use.");
    process.exitCode = 1;
  });
  server.listen(4381, "127.0.0.1", () => {
    console.log(`Register this exact redirect URI in your Spotify app: ${REDIRECT_URI}`);
    console.log("Open the local connection page on this computer:");
    console.log(SETUP_URI);
    console.log("Waiting for Spotify consent (10-minute timeout)…");
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
