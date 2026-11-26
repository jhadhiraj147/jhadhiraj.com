export const SPOTIFY_REFRESH_SECONDS = 5 * 60;
export const SPOTIFY_TIME_ZONE = "America/Chicago";
export const SPOTIFY_HISTORY_LIMIT = 50;

export type BeatTrack = {
  id: string;
  title: string;
  artists: string[];
  url: string;
  observedPlays: number;
};

export type SpotifyBeats = {
  status: "connected";
  tracks: BeatTrack[];
  sampledPlays: number;
  historyLimit: number;
  weekStartsAt: string;
  fetchedAt: string;
  timeZone: string;
};

export type SpotifyBeatsResponse = SpotifyBeats | {
  status: "disconnected" | "unavailable";
  message: string;
};

/** Monday at midnight in Nashville, including the correct DST offset. */
export function spotifyWeekStart(now: Date): Date {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid date");
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SPOTIFY_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const localParts = (date: Date) => Object.fromEntries(
    formatter.formatToParts(date).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, Number(value)]),
  );
  const local = localParts(now);
  const wallDate = Date.UTC(local.year, local.month - 1, local.day);
  const daysSinceMonday = (new Date(wallDate).getUTCDay() + 6) % 7;
  const mondayWall = wallDate - daysSinceMonday * 86_400_000;
  let guess = mondayWall;
  // Convert the desired local wall time back to an instant, without assuming CST/CDT.
  for (let index = 0; index < 3; index++) {
    const parts = localParts(new Date(guess));
    const observedWall = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    guess += mondayWall - observedWall;
  }
  return new Date(guess);
}

/** Rank only the current week's plays present in the latest single-page snapshot. */
export function summarizeSpotifyBeats(data: unknown, now = new Date()): SpotifyBeats {
  if (!data || typeof data !== "object" || !Array.isArray((data as { items?: unknown }).items)) {
    throw new Error("Invalid Spotify response");
  }
  const cutoff = spotifyWeekStart(now);
  const items = (data as { items: unknown[] }).items.slice(0, SPOTIFY_HISTORY_LIMIT);
  const tracks = new Map<string, BeatTrack & { lastPlayed: number }>();
  const seen = new Set<string>();
  let sampledPlays = 0;

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const play = item as { played_at?: unknown; track?: unknown };
    if (typeof play.played_at !== "string" || !play.track || typeof play.track !== "object") continue;
    const playedAt = Date.parse(play.played_at);
    if (!Number.isFinite(playedAt) || playedAt < cutoff.getTime() || playedAt > now.getTime()) continue;
    const track = play.track as Record<string, unknown>;
    if (typeof track.id !== "string" || !/^[A-Za-z0-9]{22}$/.test(track.id) ||
        typeof track.name !== "string" || !track.name.trim() || track.is_local === true || track.type !== "track") continue;
    const identity = `${track.id}:${playedAt}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    sampledPlays++;
    const prior = tracks.get(track.id);
    if (prior) {
      prior.observedPlays++;
      prior.lastPlayed = Math.max(prior.lastPlayed, playedAt);
    } else {
      const artists = Array.isArray(track.artists)
        ? track.artists.flatMap((artist) => {
          if (!artist || typeof artist !== "object") return [];
          const name = (artist as { name?: unknown }).name;
          return typeof name === "string" && name.trim() ? [name] : [];
        })
        : [];
      tracks.set(track.id, {
        id: track.id, title: track.name, artists,
        url: `https://open.spotify.com/track/${track.id}`,
        observedPlays: 1, lastPlayed: playedAt,
      });
    }
  }

  return {
    status: "connected",
    tracks: [...tracks.values()]
      .sort((left, right) => right.observedPlays - left.observedPlays || right.lastPlayed - left.lastPlayed)
      .slice(0, 5)
      .map(({ id, title, artists, url, observedPlays }) => ({ id, title, artists, url, observedPlays })),
    sampledPlays,
    historyLimit: SPOTIFY_HISTORY_LIMIT,
    weekStartsAt: cutoff.toISOString(),
    fetchedAt: now.toISOString(),
    timeZone: SPOTIFY_TIME_ZONE,
  };
}
