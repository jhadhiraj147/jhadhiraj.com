import test from "node:test";
import assert from "node:assert/strict";
import { GITHUB_USERNAME, isGitHubProjectUrl, isGitHubProjectsResponse, selectGitHubProjects } from "../lib/github-projects.ts";

const repo = (id, extra = {}) => ({
  id,
  name: `repo-${id}`,
  owner: { login: GITHUB_USERNAME },
  html_url: `https://github.com/${GITHUB_USERNAME}/repo-${id}`,
  private: false,
  fork: false,
  archived: false,
  disabled: false,
  pushed_at: `2026-01-${String(id).padStart(2, "0")}T00:00:00Z`,
  ...extra,
});

test("only publishes the owner's active original public repositories", () => {
  const result = selectGitHubProjects([
    repo(1),
    repo(2, { private: true }),
    repo(3, { fork: true }),
    repo(4, { archived: true }),
    repo(5, { disabled: true }),
    repo(6, { owner: { login: "someone-else" } }),
    repo(7, { name: GITHUB_USERNAME }),
    repo(8, { html_url: "javascript:alert(1)" }),
    repo(9, { pushed_at: "not-a-date" }),
    null,
    {},
  ]);
  assert.deepEqual(result.map(({ id }) => id), [1]);
});

test("returns the six most recently pushed repositories rather than stars", () => {
  const input = Array.from({ length: 9 }, (_, index) => repo(index + 1, { stargazers_count: 100 - index }));
  assert.deepEqual(selectGitHubProjects(input).map(({ id }) => id), [9, 8, 7, 6, 5, 4]);
});

test("normalizes missing metadata and limits topics without returning extra API fields", () => {
  const [result] = selectGitHubProjects([repo(1, {
    topics: ["go", 12, "systems", "linux", "backend"],
    token: "must-not-leak",
  })]);
  assert.equal(result.description, null);
  assert.equal(result.language, null);
  assert.equal(result.stars, 0);
  assert.equal(result.forks, 0);
  assert.deepEqual(result.topics, ["go", "systems", "linux"]);
  assert.equal("token" in result, false);
});

test("rejects error payloads and accepts a genuinely empty list", () => {
  assert.throws(() => selectGitHubProjects({ message: "API rate limit exceeded" }));
  assert.deepEqual(selectGitHubProjects([]), []);
});

test("uses the repository update date when an empty repository has never been pushed", () => {
  const updatedAt = "2026-10-21T12:34:56Z";
  const [result] = selectGitHubProjects([repo(1, { pushed_at: null, updated_at: updatedAt })]);
  assert.equal(result.updatedAt, updatedAt);
});

test("omits repositories with unusable timestamps instead of displaying Invalid Date", () => {
  assert.deepEqual(selectGitHubProjects([
    repo(1, { pushed_at: null, updated_at: null }),
    repo(2, { pushed_at: "invalid-date", updated_at: "2026-10-21T12:34:56Z" }),
    repo(3, { pushed_at: null, updated_at: 42 }),
  ]), []);
});

test("repository URLs cannot traverse outside the owner path or point to another destination", () => {
  for (const url of [
    `https://github.com/${GITHUB_USERNAME}/../another-owner`,
    `https://github.com/${GITHUB_USERNAME}/%2e%2e/another-owner`,
    `https://github.com/${GITHUB_USERNAME}/repo-1/issues`,
    `https://github.com/${GITHUB_USERNAME}/repo-1?next=https://example.com`,
    `https://github.com/${GITHUB_USERNAME}/repo-1#fragment`,
    `https://github.com/${GITHUB_USERNAME}/repo-1\n`,
    `https://github.com@evil.example/${GITHUB_USERNAME}/repo-1`,
    `https://github.com/${GITHUB_USERNAME}/repo-1\\..\\another-owner`,
    `https://github.com/another-owner/repo-1`,
  ]) {
    assert.equal(isGitHubProjectUrl(url), false, url);
    assert.deepEqual(selectGitHubProjects([repo(1, { html_url: url })]), []);
  }
  assert.equal(isGitHubProjectUrl(`https://github.com/${GITHUB_USERNAME}/repo-1`, "repo-1"), true);
  assert.equal(isGitHubProjectUrl(`https://github.com/${GITHUB_USERNAME}/repo-1`, "different-name"), false);
});

test("GitHub owner names are case-insensitive and duplicate repository IDs are omitted", () => {
  const result = selectGitHubProjects([
    repo(1, { owner: { login: GITHUB_USERNAME.toUpperCase() } }),
    repo(1),
    repo(2, { id: NaN }),
    repo(3, { id: -1 }),
    repo(4, { id: 1.5 }),
  ]);
  assert.deepEqual(result.map(project => project.id), [1]);
});

test("normalizes invalid counts and duplicate topics before publishing", () => {
  const [project] = selectGitHubProjects([repo(1, {
    stargazers_count: -2,
    forks_count: Infinity,
    topics: ["linux", "linux", "go", "systems"],
  })]);
  assert.equal(project.stars, 0);
  assert.equal(project.forks, 0);
  assert.deepEqual(project.topics, ["linux", "go", "systems"]);
});

test("browser response validation rejects malformed and duplicate entries", () => {
  const projects = selectGitHubProjects([repo(1)]);
  const response = { fetchedAt: "2026-11-26T12:00:00Z", projects };
  assert.equal(isGitHubProjectsResponse(response), true);
  assert.equal(isGitHubProjectsResponse({ ...response, projects: [] }), true);
  assert.equal(isGitHubProjectsResponse(null), false);
  assert.equal(isGitHubProjectsResponse({ ...response, projects: [null] }), false);
  assert.equal(isGitHubProjectsResponse({ ...response, projects: [projects[0], projects[0]] }), false);
  for (const change of [
    { url: "javascript:alert(1)" }, { id: -1 }, { stars: NaN }, { forks: 0.5 },
    { topics: null }, { topics: ["linux", 12] }, { updatedAt: "invalid" },
  ]) assert.equal(isGitHubProjectsResponse({ ...response, projects: [{ ...projects[0], ...change }] }), false);
});
