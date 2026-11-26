export const GITHUB_USERNAME = "jhadhiraj147";
export const PROJECT_REFRESH_SECONDS = 60 * 60;

export type GitHubProject = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

export type GitHubProjectsResponse = {
  projects: GitHubProject[];
  fetchedAt: string;
};

/** Only link to a repository on this portfolio owner's GitHub account. */
export function isGitHubProjectUrl(value: unknown, name?: string): value is string {
  if (typeof value !== "string" || value !== value.trim() || !/^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(value)) return false;
  const url = new URL(value);
  const [, owner, repository] = url.pathname.split("/");
  return owner?.toLowerCase() === GITHUB_USERNAME.toLowerCase() &&
    !!repository && repository !== "." && repository !== ".." &&
    (name === undefined || repository === name);
}

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

/** Validate the public response before rendering it, including legacy sections. */
export function isGitHubProjectsResponse(value: unknown): value is GitHubProjectsResponse {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<GitHubProjectsResponse>;
  if (typeof result.fetchedAt !== "string" || !Number.isFinite(Date.parse(result.fetchedAt)) ||
      !Array.isArray(result.projects) || result.projects.length > 6) return false;
  const ids = new Set<number>();
  return result.projects.every(project => {
    if (!project || !isCount(project.id) || project.id === 0 || ids.has(project.id) ||
        typeof project.name !== "string" || !isGitHubProjectUrl(project.url, project.name) ||
        typeof project.updatedAt !== "string" || !Number.isFinite(Date.parse(project.updatedAt)) ||
        !(project.description === null || typeof project.description === "string") ||
        !(project.language === null || typeof project.language === "string") ||
        !isCount(project.stars) || !isCount(project.forks) ||
        !Array.isArray(project.topics) || project.topics.length > 3 ||
        !project.topics.every(topic => typeof topic === "string")) return false;
    ids.add(project.id);
    return true;
  });
}

/** Return only this owner's active, public, original repositories. */
export function selectGitHubProjects(data: unknown): GitHubProject[] {
  if (!Array.isArray(data)) throw new Error("Invalid GitHub response");

  const projects: GitHubProject[] = [];
  const ids = new Set<number>();
  for (const value of data) {
    if (!value || typeof value !== "object") continue;
    const repo = value as Record<string, unknown>;
    const owner = repo.owner as { login?: unknown } | undefined;
    if (
      typeof owner?.login !== "string" ||
      owner.login.toLowerCase() !== GITHUB_USERNAME.toLowerCase() ||
      repo.private !== false ||
      repo.fork !== false ||
      repo.archived !== false ||
      repo.disabled !== false ||
      !isCount(repo.id) || repo.id === 0 || ids.has(repo.id) ||
      typeof repo.name !== "string" ||
      repo.name.toLowerCase() === GITHUB_USERNAME.toLowerCase() ||
      !isGitHubProjectUrl(repo.html_url, repo.name)
    ) continue;

    const updatedAt = typeof repo.pushed_at === "string" ? repo.pushed_at : repo.updated_at;
    if (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt))) continue;
    ids.add(repo.id);

    projects.push({
      id: repo.id,
      name: repo.name,
      description: typeof repo.description === "string" ? repo.description : null,
      url: repo.html_url,
      language: typeof repo.language === "string" ? repo.language : null,
      stars: isCount(repo.stargazers_count) ? repo.stargazers_count : 0,
      forks: isCount(repo.forks_count) ? repo.forks_count : 0,
      updatedAt,
      topics: Array.isArray(repo.topics)
        ? [...new Set(repo.topics.filter((topic): topic is string => typeof topic === "string"))].slice(0, 3)
        : [],
    });
  }

  return projects.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 6);
}
