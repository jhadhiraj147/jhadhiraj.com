import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { createSpotifyReader } from "@/lib/spotify-client";
import { SPOTIFY_REFRESH_SECONDS } from "@/lib/spotify-beats";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let reader: ReturnType<typeof createSpotifyReader> | undefined;
const readBeats = unstable_cache(async () => {
  if (!reader) reader = createSpotifyReader({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN!,
  });
  return reader();
}, ["spotify-weekly-recent-plays"], { revalidate: SPOTIFY_REFRESH_SECONDS });

export async function GET() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json(
      { status: "disconnected", message: "Spotify is not connected yet." },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    return NextResponse.json(await readBeats(), {
      headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable", message: "Spotify listening history is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
