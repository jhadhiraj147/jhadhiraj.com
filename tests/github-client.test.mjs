import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Match the application's extensionless TypeScript import in Node's test runner.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./github-projects" && context.parentURL?.endsWith("/lib/github-client.ts")) {
      return nextResolve("./github-projects.ts", context);
    }
    return nextResolve(specifier, context);
  },
});
const { createGitHubProjectsClient, githubRetryDelay } = await import("../lib/github-client.ts");
const now = Date.parse("2026-11-26T12:00:00Z");
const repository = {
  id: 1, name: "test-repo", owner: { login: "jhadhiraj147" },
  html_url: "https://github.com/jhadhiraj147/test-repo",
  private: false, fork: false, archived: false, disabled: false,
  pushed_at: "2026-11-25T12:00:00Z",
};
const success = () => Response.json([repository]);

test("concurrent server cache misses share the entire upstream request", async () => {
  let calls = 0;
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const getProjects = createGitHubProjectsClient({ now: () => now, fetcher: async () => {
    calls++;
    await gate;
    return success();
  } });
  const requests = Array.from({ length: 10 }, () => getProjects());
  assert(requests.every(request => request === requests[0]));
  assert.equal(calls, 1);
  release();
  const results = await Promise.all(requests);
  assert(results.every(result => result.projects[0].name === "test-repo"));
  assert.equal(results[0].fetchedAt, new Date(now).toISOString());
});

test("network and malformed JSON failures cool down and recover after 30 seconds", async () => {
  for (const failure of [() => { throw new Error("PRIVATE diagnostic detail"); }, () => Response.json({ message: "PRIVATE error body" })]) {
    let calls = 0;
    let clock = now;
    const getProjects = createGitHubProjectsClient({ now: () => clock, fetcher: async () => {
      calls++;
      return calls === 1 ? failure() : success();
    } });
    await assert.rejects(getProjects(), { message: "GitHub projects are temporarily unavailable." });
    for (let index = 0; index < 5; index++) await assert.rejects(getProjects(), { message: "GitHub projects are temporarily unavailable." });
    assert.equal(calls, 1);
    clock += 30_000;
    assert.equal((await getProjects()).projects.length, 1);
    assert.equal(calls, 2);
  }
});

test("429 retry hints suppress repeated requests until the bounded retry time", async () => {
  let calls = 0;
  let clock = now;
  const getProjects = createGitHubProjectsClient({ now: () => clock, fetcher: async () => {
    calls++;
    return calls === 1 ? new Response("PRIVATE upstream body", { status: 429, headers: { "Retry-After": "120" } }) : success();
  } });
  await assert.rejects(getProjects());
  clock += 119_999;
  await assert.rejects(getProjects());
  assert.equal(calls, 1);
  clock++;
  await getProjects();
  assert.equal(calls, 2);
});

test("changing an optional token bypasses a prior authentication failure without leaking tokens", async () => {
  const received = [];
  const getProjects = createGitHubProjectsClient({ now: () => now, fetcher: async (_url, options) => {
    received.push(options.headers.Authorization);
    assert.equal(options.redirect, "error");
    return received.length === 1 ? new Response("invalid token", { status: 401 }) : success();
  } });
  await assert.rejects(getProjects("dummy-old-token"));
  await assert.rejects(getProjects("dummy-old-token"));
  const result = await getProjects("dummy-new-token");
  assert.deepEqual(received, ["Bearer dummy-old-token", "Bearer dummy-new-token"]);
  assert(!JSON.stringify(result).includes("token"));
});

test("a superseded request cannot clear the replacement token's cooldown", async () => {
  let resolveOld;
  let calls = 0;
  const getProjects = createGitHubProjectsClient({ now: () => now, fetcher: async () => {
    calls++;
    if (calls === 1) return new Promise(resolve => { resolveOld = resolve; });
    return new Response("rate limit", { status: 429, headers: { "Retry-After": "60" } });
  } });
  const old = getProjects("dummy-old-token");
  await assert.rejects(getProjects("dummy-new-token"));
  resolveOld(success());
  await old;
  await assert.rejects(getProjects("dummy-new-token"));
  assert.equal(calls, 2);
});

test("retry hints support HTTP dates and rate-limit resets, with safe fallbacks and bounds", () => {
  assert.equal(githubRetryDelay(new Headers(), now), 30_000);
  assert.equal(githubRetryDelay(new Headers({ "Retry-After": "60" }), now), 60_000);
  assert.equal(githubRetryDelay(new Headers({ "Retry-After": new Date(now + 45_000).toUTCString() }), now), 45_000);
  assert.equal(githubRetryDelay(new Headers({ "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(now / 1000 + 90) }), now), 90_000);
  assert.equal(githubRetryDelay(new Headers({ "X-RateLimit-Remaining": "1", "X-RateLimit-Reset": String(now / 1000 + 90) }), now), 30_000);
  assert.equal(githubRetryDelay(new Headers({ "Retry-After": "10", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(now / 1000 + 20) }), now), 20_000);
  for (const value of ["-1", "nonsense", "Infinity", "0", new Date(now - 1000).toUTCString()]) {
    assert.equal(githubRetryDelay(new Headers({ "Retry-After": value }), now), 30_000, value);
  }
  assert.equal(githubRetryDelay(new Headers({ "Retry-After": "999999999999" }), now), 3_600_000);
});

test("repeated upstream failures use exponential backoff and rate limits without hints wait a minute", async () => {
  let clock = now;
  let calls = 0;
  const getProjects = createGitHubProjectsClient({ now: () => clock, fetcher: async () => {
    calls++;
    return new Response("Unavailable", { status: 503 });
  } });
  await assert.rejects(getProjects());
  clock += 30_000;
  await assert.rejects(getProjects());
  clock += 30_000;
  await assert.rejects(getProjects());
  assert.equal(calls, 2);
  clock += 30_000;
  await assert.rejects(getProjects());
  assert.equal(calls, 3);
  for (const status of [403, 429]) {
    let requests = 0;
    const limited = createGitHubProjectsClient({ now: () => clock, fetcher: async () => {
      requests++;
      return new Response("Rate limited", { status });
    } });
    await assert.rejects(limited());
    clock += 59_999;
    await assert.rejects(limited());
    assert.equal(requests, 1);
    clock++;
    await assert.rejects(limited());
    assert.equal(requests, 2);
  }
});
