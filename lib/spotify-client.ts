import { Buffer } from "node:buffer";
import { summarizeSpotifyBeats, SPOTIFY_HISTORY_LIMIT, type SpotifyBeats } from "./spotify-beats";

export type SpotifyCredentials = { clientId: string; clientSecret: string; refreshToken: string };

/** Server-only reader. Tokens and Spotify errors never enter the public payload. */
export function createSpotifyReader(credentials: SpotifyCredentials, fetcher: typeof fetch = fetch) {
  let accessToken = "";
  let expiresAt = 0;
  let refreshToken = credentials.refreshToken;
  let inFlight: Promise<SpotifyBeats> | undefined;
  let retryAt = 0;
  let authorizationFailed = false;

  const observeRateLimit = (response: Response) => {
    if (response.status !== 429) return;
    const value = response.headers.get("Retry-After");
    const seconds = value === null ? NaN : Number(value);
    const date = value === null ? NaN : Date.parse(value);
    const delay = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000
      : Number.isFinite(date) ? date - Date.now() : 30_000;
    retryAt = Math.max(retryAt, Date.now() + Math.max(1000, delay));
  };

  const getAccessToken = async (signal: AbortSignal): Promise<string> => {
    if (accessToken && Date.now() < expiresAt) return accessToken;
    const response = await fetcher("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      cache: "no-store", signal,
    });
    observeRateLimit(response);
    if (!response.ok) {
      // Revoked/expired grants cannot recover through repeated refresh requests.
      const error = await response.json().catch(() => null) as { error?: unknown } | null;
      if (error?.error === "invalid_grant" || error?.error === "invalid_client") authorizationFailed = true;
      throw new Error("Spotify authorization unavailable");
    }
    const data = await response.json() as { access_token?: unknown; expires_in?: unknown; refresh_token?: unknown };
    if (typeof data.access_token !== "string" || !data.access_token || typeof data.expires_in !== "number" || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
      throw new Error("Invalid Spotify authorization response");
    }
    accessToken = data.access_token;
    expiresAt = Date.now() + Math.max(0, data.expires_in - 60) * 1000;
    if (typeof data.refresh_token === "string" && data.refresh_token) refreshToken = data.refresh_token;
    return accessToken;
  };

  return async () => {
    if (inFlight) return inFlight;
    if (authorizationFailed || Date.now() < retryAt) throw new Error("Spotify listening history unavailable");
    // Share a complete snapshot request, not just its token refresh, during bursts.
    const attempt = (async () => {
      // One deadline covers authorization, history and a possible 401 retry.
      const signal = AbortSignal.timeout(15_000);
      for (let attemptIndex = 0; attemptIndex < 2; attemptIndex++) {
        const token = await getAccessToken(signal);
        const response = await fetcher(`https://api.spotify.com/v1/me/player/recently-played?limit=${SPOTIFY_HISTORY_LIMIT}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", signal,
        });
        observeRateLimit(response);
        if (response.status === 401) {
          accessToken = ""; expiresAt = 0;
          if (attemptIndex === 0) continue;
        }
        if (!response.ok) throw new Error("Spotify listening history unavailable");
        return summarizeSpotifyBeats(await response.json());
      }
      throw new Error("Spotify listening history unavailable");
    })();
    inFlight = attempt;
    try { return await attempt; }
    catch {
      // The public route is callable by anyone. Failures must not hammer Spotify.
      retryAt = Math.max(retryAt, Date.now() + 15_000);
      throw new Error("Spotify listening history unavailable");
    } finally {
      if (inFlight === attempt) inFlight = undefined;
    }
  };
}
