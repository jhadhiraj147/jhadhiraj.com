import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spotifyWeekStart, summarizeSpotifyBeats } from "../lib/spotify-beats.ts";
import { REDIRECT_URI, SETUP_URI, renderSpotifySetupPage, spotifyAuthorizationUrl, validSpotifyState, saveSpotifyRefreshToken, parseSpotifySetupRequest } from "../scripts/connect-spotify.mjs";

const now = new Date("2026-11-26T18:00:00Z");
const firstId = "0123456789ABCDEFGHIJKL";
const secondId = "123456789ABCDEFGHIJKLM";
const play = (id, date, extra = {}) => ({
  played_at: date,
  track: { id, type: "track", name: `Song ${id}`, artists: [{ name: "Artist" }], is_local: false, ...extra },
});

test("week starts Monday at Nashville midnight across CST, CDT and DST changes", () => {
  assert.equal(spotifyWeekStart(now).toISOString(), "2026-11-23T06:00:00.000Z");
  assert.equal(spotifyWeekStart(new Date("2026-07-16T18:00:00Z")).toISOString(), "2026-07-13T05:00:00.000Z");
  assert.equal(spotifyWeekStart(new Date("2026-03-08T18:00:00Z")).toISOString(), "2026-03-02T06:00:00.000Z");
  assert.equal(spotifyWeekStart(new Date("2026-11-02T05:59:00Z")).toISOString(), "2026-10-26T05:00:00.000Z");
  assert.equal(spotifyWeekStart(new Date("2026-11-02T06:00:00Z")).toISOString(), "2026-11-02T06:00:00.000Z");
});

test("ranks current-week observed repeats and deduplicates identical history entries", () => {
  const first = play(firstId, "2026-11-25T12:00:00Z");
  const result = summarizeSpotifyBeats({ items: [
    first, first,
    play(firstId, "2026-11-24T12:00:00Z"),
    play(secondId, "2026-11-26T12:00:00Z"),
    play(secondId, "2026-11-22T12:00:00Z"),
  ] }, now);
  assert.equal(result.sampledPlays, 3);
  assert.deepEqual(result.tracks.map(({ id, observedPlays }) => ({ id, observedPlays })), [
    { id: firstId, observedPlays: 2 }, { id: secondId, observedPlays: 1 },
  ]);
  assert.equal(result.historyLimit, 50);
  assert.equal(result.timeZone, "America/Chicago");
});

test("does not count past-week, invalid, future, episode, local or malformed entries", () => {
  const result = summarizeSpotifyBeats({ items: [
    play(firstId, "2026-11-23T05:59:59Z"),
    play(firstId, "2026-11-27T12:00:00Z"),
    play(firstId, "bad-date"),
    play(firstId, "2026-11-25T12:00:00Z", { type: "episode" }),
    play(firstId, "2026-11-25T12:00:00Z", { is_local: true }),
    play("../../script", "2026-11-25T12:00:00Z"),
    play(firstId, "2026-11-25T12:00:00Z", { name: "" }), null, {},
    play(firstId, "2026-11-23T06:00:00Z", { external_urls: { spotify: "javascript:alert(1)" }, secret: "nope" }),
  ] }, now);
  assert.equal(result.sampledPlays, 1);
  assert.equal(result.tracks[0].url, `https://open.spotify.com/track/${firstId}`);
  assert.equal("secret" in result.tracks[0], false);
});

test("treats a single history page as a bounded sample and returns five tracks", () => {
  const items = Array.from({ length: 70 }, (_, i) => play(String(i).padStart(22, "0"), `2026-11-25T12:${String(i % 60).padStart(2, "0")}:00Z`));
  const result = summarizeSpotifyBeats({ items }, now);
  assert.equal(result.sampledPlays, 50);
  assert.equal(result.tracks.length, 5);
  assert.deepEqual(summarizeSpotifyBeats({ items: [] }, now).tracks, []);
  assert.throws(() => summarizeSpotifyBeats({ error: "not-history" }, now));
});

test("OAuth uses loopback IP, read-only scope and state that must match", () => {
  const url = new URL(spotifyAuthorizationUrl("public-client-id", "test-state"));
  assert.equal(url.origin, "https://accounts.spotify.com");
  assert.equal(url.searchParams.get("redirect_uri"), REDIRECT_URI);
  assert.equal(url.searchParams.get("scope"), "user-read-recently-played");
  assert.equal(url.searchParams.get("state"), "test-state");
  assert(validSpotifyState("test-state", "test-state"));
  assert(!validSpotifyState("wrong", "test-state"));
  assert(!validSpotifyState(null, "test-state"));
  assert(!validSpotifyState("", ""));
});

test("local setup page guides registration and consent without embedding credentials or state", () => {
  const html = renderSpotifySetupPage();
  assert.equal(SETUP_URI, "http://127.0.0.1:4381/");
  assert(html.includes(`<pre>${REDIRECT_URI}</pre>`));
  assert(html.includes('href="https://developer.spotify.com/dashboard"'));
  assert(html.includes('href="/authorize"'));
  assert(html.includes('href="http://localhost:3000"'));
  assert(html.includes("<code>beats</code>"));
  assert(!html.includes("accounts.spotify.com/authorize"));
  assert(!html.includes("client_id="));
  assert(!html.includes("client_secret="));
  assert(!html.includes("state="));
  assert(!html.includes("#beats"));
});

test("local helper rejects rebinding authorities, foreign origins and malformed request targets", () => {
  const request = (url, headers = {}) => ({ url, headers: { host: "127.0.0.1:4381", ...headers } });
  assert.equal(parseSpotifySetupRequest(request("/spotify/callback?state=opaque"))?.pathname, "/spotify/callback");
  assert.equal(parseSpotifySetupRequest(request("/authorize", { origin: "http://127.0.0.1:4381" }))?.pathname, "/authorize");
  assert.equal(parseSpotifySetupRequest(request("/", { host: "attacker.example:4381" })), null);
  assert.equal(parseSpotifySetupRequest(request("/authorize", { origin: "https://attacker.example" })), null);
  assert.equal(parseSpotifySetupRequest(request("/authorize", { origin: "null" })), null);
  for (const target of ["https://attacker.example/", "//attacker.example/", "/\\attacker.example/", "/bad\nrequest", "http://["]) {
    assert.equal(parseSpotifySetupRequest(request(target)), null);
  }
});

test("OAuth saves private token locally without overwriting unrelated settings", async () => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-spotify-"));
  try {
    const path = join(directory, ".env.local");
    await writeFile(path, "GITHUB_TOKEN=preserve-this\nSPOTIFY_CLIENT_ID=public-id\nSPOTIFY_REFRESH_TOKEN=old\n");
    await saveSpotifyRefreshToken(path, "fake-test-refresh-token");
    const content = await readFile(path, "utf8");
    assert(content.includes("GITHUB_TOKEN=preserve-this"));
    assert(content.includes('SPOTIFY_REFRESH_TOKEN="fake-test-refresh-token"'));
    assert.equal(content.match(/SPOTIFY_REFRESH_TOKEN=/g)?.length, 1);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
    assert.deepEqual(await readdir(directory), [".env.local"]);
    await assert.rejects(saveSpotifyRefreshToken(path, "bad\ninjected=value"));
    assert.equal(await readFile(path, "utf8"), content);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

// Node's native TS runner needs the extension that Next's bundler resolves for us.
const { registerHooks } = await import("node:module");
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./spotify-beats" && context.parentURL?.endsWith("/lib/spotify-client.ts")) {
      return nextResolve("./spotify-beats.ts", context);
    }
    return nextResolve(specifier, context);
  },
});
const { createSpotifyReader } = await import("../lib/spotify-client.ts");
const credentials = { clientId: "test-client", clientSecret: "test-secret", refreshToken: "test-refresh" };

test("server reader keeps credentials server-side and reuses unexpired access tokens", async () => {
  let tokens = 0;
  let histories = 0;
  const reader = createSpotifyReader(credentials, async (url, options) => {
    if (url === "https://accounts.spotify.com/api/token") {
      tokens++;
      assert.equal(options.method, "POST");
      assert.equal(options.headers.Authorization, `Basic ${Buffer.from("test-client:test-secret").toString("base64")}`);
      assert.equal(options.body.get("grant_type"), "refresh_token");
      assert.equal(options.body.get("refresh_token"), "test-refresh");
      return Response.json({ access_token: "test-access", expires_in: 3600 });
    }
    histories++;
    assert.equal(url, "https://api.spotify.com/v1/me/player/recently-played?limit=50");
    assert.equal(options.headers.Authorization, "Bearer test-access");
    const result = Response.json({ items: [], secret: "not-public" });
    return result;
  });
  const first = await reader();
  const second = await reader();
  assert.equal(tokens, 1);
  assert.equal(histories, 2);
  assert.equal(first.status, "connected");
  assert.equal(second.status, "connected");
  assert(!JSON.stringify(first).includes("test-secret"));
  assert(!JSON.stringify(first).includes("test-access"));
});

test("server reader shares concurrent complete snapshots, including the history request", async () => {
  let tokens = 0;
  let histories = 0;
  const reader = createSpotifyReader(credentials, async (url) => {
    if (url.includes("/api/token")) {
      tokens++;
      await new Promise(resolve => setTimeout(resolve, 5));
      return Response.json({ access_token: "test-access", expires_in: 3600 });
    }
    histories++;
    return Response.json({ items: [] });
  });
  const attempts = await Promise.all([reader(), reader(), reader()]);
  assert.equal(tokens, 1);
  assert.equal(histories, 1);
  assert(attempts.every(result => result.status === "connected"));
});

test("server reader refreshes and retries one expired access token within the same request", async () => {
  let tokens = 0;
  let histories = 0;
  const signals = [];
  const reader = createSpotifyReader(credentials, async (url, options) => {
    signals.push(options.signal);
    if (url.includes("/api/token")) {
      tokens++;
      return Response.json({ access_token: `test-access-${tokens}`, expires_in: 3600 });
    }
    histories++;
    assert.equal(options.headers.Authorization, `Bearer test-access-${histories}`);
    return histories === 1 ? Response.json({}, { status: 401 }) : Response.json({ items: [] });
  });
  assert.equal((await reader()).status, "connected");
  assert.equal(tokens, 2);
  assert.equal(histories, 2);
  assert(signals.every(signal => signal === signals[0]));
});

test("server reader bounds unauthorized retries, hides upstream details and backs off", async () => {
  let tokens = 0;
  const reader = createSpotifyReader(credentials, async (url) => {
    if (url.includes("/api/token")) {
      tokens++;
      return Response.json({ access_token: "test-access", expires_in: 3600 });
    }
    return Response.json({ error: { message: "private-upstream-detail" } }, { status: 401 });
  });
  const attempts = await Promise.allSettled([reader(), reader()]);
  assert.equal(tokens, 2);
  assert(attempts.every(result => result.status === "rejected"));
  assert(attempts.every(result => !String(result.reason).includes("private-upstream-detail")));
  await assert.rejects(reader());
  assert.equal(tokens, 2);
});

test("server reader honors Retry-After instead of multiplying rate-limited history requests", async () => {
  let time = now.getTime();
  const originalNow = Date.now;
  Date.now = () => time;
  let histories = 0;
  try {
    const reader = createSpotifyReader(credentials, async (url) => {
      if (url.includes("/api/token")) return Response.json({ access_token: "test-access", expires_in: 3600 });
      histories++;
      return histories === 1
        ? Response.json({}, { status: 429, headers: { "Retry-After": "120" } })
        : Response.json({ items: [] });
    });
    await assert.rejects(reader());
    await assert.rejects(reader());
    time += 119_999;
    await assert.rejects(reader());
    assert.equal(histories, 1);
    time++;
    assert.equal((await reader()).status, "connected");
    assert.equal(histories, 2);
  } finally { Date.now = originalNow; }
});

test("expired/revoked refresh grants are not retried on every public request", async () => {
  let tokens = 0;
  const reader = createSpotifyReader(credentials, async () => {
    tokens++;
    return Response.json({ error: "invalid_grant", private: "not-public" }, { status: 400 });
  });
  await assert.rejects(reader(), error => !String(error).includes("not-public"));
  const originalNow = Date.now;
  Date.now = () => now.getTime() + 86_400_000;
  try { await assert.rejects(reader()); }
  finally { Date.now = originalNow; }
  assert.equal(tokens, 1);
});

test("server reader remembers rotated refresh token without exposing it", async () => {
  let tokens = 0;
  const reader = createSpotifyReader(credentials, async (url, options) => {
    if (url.includes("/api/token")) {
      tokens++;
      assert.equal(options.body.get("refresh_token"), tokens === 1 ? "test-refresh" : "rotated-refresh");
      return Response.json({ access_token: "test-access", expires_in: 30, refresh_token: "rotated-refresh" });
    }
    return Response.json({ items: [] });
  });
  const first = await reader();
  await reader();
  assert.equal(tokens, 2);
  assert(!JSON.stringify(first).includes("rotated-refresh"));
});
