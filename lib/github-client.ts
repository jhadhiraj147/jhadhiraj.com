import { GITHUB_USERNAME, selectGitHubProjects, type GitHubProjectsResponse } from "./github-projects";

const DEFAULT_FAILURE_DELAY = 30_000;
const MAX_FAILURE_DELAY = 60 * 60_000;

/** Retry hints are advisory and bounded so malformed headers cannot disable the feed. */
export function githubRetryDelay(headers: Headers, now: number, fallback = DEFAULT_FAILURE_DELAY): number {
  const delays: number[] = [];
  const retryAfter = headers.get("retry-after")?.trim();
  if (retryAfter && retryAfter.length < 128) {
    const delay = /^\d+(?:\.\d+)?$/.test(retryAfter)
      ? Number(retryAfter) * 1000
      : Date.parse(retryAfter) - now;
    if (Number.isFinite(delay) && delay > 0) delays.push(delay);
  }
  const rateLimitReset = headers.get("x-ratelimit-reset")?.trim();
  if (headers.get("x-ratelimit-remaining") === "0" && rateLimitReset && /^\d+$/.test(rateLimitReset)) {
    const delay = Number(rateLimitReset) * 1000 - now;
    if (Number.isFinite(delay) && delay > 0) delays.push(delay);
  }
  return Math.min(MAX_FAILURE_DELAY, Math.max(1000, delays.length ? Math.max(...delays) : fallback));
}

/** Server-side request coordination; never pass credentials through a public response. */
export function createGitHubProjectsClient({
  fetcher = fetch,
  now = Date.now,
}: { fetcher?: typeof fetch; now?: () => number } = {}) {
  let credential: string | undefined;
  let inFlight: Promise<GitHubProjectsResponse> | undefined;
  let retryAt = 0;
  let failureCount = 0;

  return function getProjects(token?: string): Promise<GitHubProjectsResponse> {
    const nextCredential = token?.trim() || undefined;
    // A newly supplied/replaced optional token must be able to recover immediately.
    if (nextCredential !== credential) {
      credential = nextCredential;
      inFlight = undefined;
      retryAt = 0;
      failureCount = 0;
    }
    if (inFlight) return inFlight;
    if (retryAt > now()) return Promise.reject(new Error("GitHub projects are temporarily unavailable."));

    const requestCredential = credential;
    const request = (async () => {
      let failureDelay = Math.min(5 * 60_000, DEFAULT_FAILURE_DELAY * 2 ** failureCount);
      try {
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
          "User-Agent": "jhadhiraj.com-portfolio",
        };
        if (requestCredential) headers.Authorization = `Bearer ${requestCredential}`;
        const response = await fetcher(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&direction=desc&per_page=100`,
          { headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000) },
        );
        if (!response.ok) {
          failureDelay = githubRetryDelay(response.headers, now(), Math.max(
            failureDelay, response.status === 403 || response.status === 429 ? 60_000 : 0,
          ));
          throw new Error("Upstream unavailable");
        }
        const projects = selectGitHubProjects(await response.json());
        if (credential === requestCredential) { retryAt = 0; failureCount = 0; }
        return { projects, fetchedAt: new Date(now()).toISOString() };
      } catch {
        if (credential === requestCredential) {
          retryAt = now() + failureDelay;
          failureCount = Math.min(failureCount + 1, 5);
        }
        // Upstream bodies/errors can contain diagnostic data; expose only this constant.
        throw new Error("GitHub projects are temporarily unavailable.");
      }
    })();
    inFlight = request;
    void request.then(
      () => { if (inFlight === request) inFlight = undefined; },
      () => { if (inFlight === request) inFlight = undefined; },
    );
    return request;
  };
}
