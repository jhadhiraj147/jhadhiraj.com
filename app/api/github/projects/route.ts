import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  GITHUB_USERNAME,
  PROJECT_REFRESH_SECONDS,
} from "@/lib/github-projects";
import { createGitHubProjectsClient } from "@/lib/github-client";

// The endpoint stays dynamic; only successful GitHub data is cached for an hour.
export const dynamic = "force-dynamic";

const requestProjects = createGitHubProjectsClient();
const getProjects = unstable_cache(
  () => requestProjects(process.env.GITHUB_TOKEN),
  ["github-public-projects", GITHUB_USERNAME],
  { revalidate: PROJECT_REFRESH_SECONDS },
);

export async function GET() {
  try {
    return NextResponse.json(await getProjects(), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch {
    // Browser/CDN failures are not cached. A short private cooldown protects GitHub.
    return NextResponse.json(
      { error: "GitHub projects are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
