"use client";

import { useEffect, useState } from "react";
import { SPOTIFY_REFRESH_SECONDS, type SpotifyBeats, type SpotifyBeatsResponse } from "@/lib/spotify-beats";
import { TERMINAL_HOSTNAME, TERMINAL_USERNAME } from "@/lib/portfolio-terminal";

export default function Beats() {
  const [beats, setBeats] = useState<SpotifyBeats | null>(null);
  const [status, setStatus] = useState("Reading listening history…");

  useEffect(() => {
    let active = true;
    let inFlight = false;
    let controller: AbortController | undefined;
    let lastAttempt = 0;
    const refresh = async () => {
      if (inFlight) return;
      inFlight = true;
      lastAttempt = Date.now();
      const request = new AbortController();
      controller = request;
      const timeout = window.setTimeout(() => request.abort(), 18000);
      try {
        const response = await fetch("/api/spotify/beats", { signal: request.signal });
        const data: SpotifyBeatsResponse = await response.json();
        if (!response.ok) throw new Error("Unavailable");
        if (data.status === "connected" && Array.isArray(data.tracks)) {
          if (active) { setBeats(data); setStatus(""); }
        } else if (active) setStatus("Spotify is not connected yet.");
      } catch {
        if (active) setStatus("Listening history is temporarily unavailable.");
      } finally {
        window.clearTimeout(timeout);
        inFlight = false;
      }
    };
    const refreshIfDue = () => {
      if (document.visibilityState === "visible" && Date.now() - lastAttempt >= SPOTIFY_REFRESH_SECONDS * 1000) void refresh();
    };
    void refresh();
    const interval = window.setInterval(refreshIfDue, SPOTIFY_REFRESH_SECONDS * 1000);
    document.addEventListener("visibilitychange", refreshIfDue);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfDue);
    };
  }, []);

  return (
    <section id="beats" className="relative section-pad font-mono">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p aria-hidden="true" className="mb-4 text-caption text-accent">[{TERMINAL_USERNAME}@{TERMINAL_HOSTNAME} ~]$ cat beats.log</p>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-title font-medium text-slate-900">Beats</h2>
          <span className="text-caption text-ink-400">this week / Spotify</span>
        </div>
        <p className="mb-6 max-w-2xl text-body text-ink-500">The songs finding their way back into my headphones.</p>
        {status && <p role="status" aria-live="polite" className="border-l border-accent/35 py-2 pl-4 text-body text-ink-400">{beats ? "Showing the last listening snapshot. " : ""}{status}</p>}
        {beats && beats.tracks.length > 0 && (
          <ol className="divide-y divide-accent/15 border-y border-accent/20">
            {beats.tracks.map((track, index) => (
              <li key={track.id} className="grid grid-cols-[2ch_minmax(0,1fr)_auto] items-start gap-4 py-5 sm:gap-6">
                <span aria-hidden="true" className="pt-0.5 text-caption text-ink-400">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <a href={track.url} target="_blank" rel="noopener noreferrer" className="break-words text-body text-accent underline decoration-accent/25 underline-offset-4 transition-colors hover:decoration-accent">{track.title}</a>
                  <p className="mt-1 break-words text-caption text-ink-400">{track.artists.join(", ") || "Artist unavailable"}</p>
                </div>
                <span className="pt-0.5 text-right text-caption tabular-nums text-ink-400">{track.observedPlays} <span className="hidden sm:inline">observed </span>{track.observedPlays === 1 ? "play" : "plays"}</span>
              </li>
            ))}
          </ol>
        )}
        {beats && beats.tracks.length === 0 && <p className="text-body text-ink-400">No recent plays in this week&apos;s snapshot yet.</p>}
        {beats && <p className="mt-5 max-w-2xl text-caption leading-relaxed text-ink-400">A snapshot of Spotify&apos;s {beats.historyLimit} most recent plays, filtered from Monday in Nashville. Counts reflect this sample, not a complete weekly chart. Updates every five minutes.</p>}
        <p className="mt-6 text-caption text-ink-400"><a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/25 underline-offset-4 hover:decoration-accent">Listen on Spotify</a></p>
      </div>
    </section>
  );
}
