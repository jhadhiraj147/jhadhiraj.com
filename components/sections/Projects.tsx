"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { personal, projects } from "@/lib/data";
import {
  PROJECT_REFRESH_SECONDS,
  isGitHubProjectsResponse,
  type GitHubProjectsResponse,
} from "@/lib/github-projects";

const dateLabel = (date: string) => new Date(date).toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

export default function Projects() {
  const [github, setGithub] = useState<GitHubProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    let inFlight = false;
    let lastAttemptAt = 0;
    const refreshInterval = PROJECT_REFRESH_SECONDS * 1000;

    const refresh = async () => {
      if (inFlight) return;
      inFlight = true;
      lastAttemptAt = Date.now();
      const requestController = new AbortController();
      controller = requestController;
      // Capture this request's controller so an old timeout cannot abort a new fetch.
      const timeout = window.setTimeout(() => requestController.abort(), 12000);
      try {
        const response = await fetch("/api/github/projects", { signal: requestController.signal });
        if (!response.ok) throw new Error("Projects unavailable");
        const data: unknown = await response.json();
        if (!isGitHubProjectsResponse(data)) {
          throw new Error("Invalid projects response");
        }
        if (active) { setGithub(data); setUnavailable(false); }
      } catch {
        if (active) setUnavailable(true);
      } finally {
        window.clearTimeout(timeout);
        inFlight = false;
        if (active) setLoading(false);
      }
    };

    const refreshIfDue = () => {
      if (document.visibilityState === "visible" && Date.now() - lastAttemptAt >= refreshInterval) {
        void refresh();
      }
    };

    void refresh();
    const interval = window.setInterval(refreshIfDue, refreshInterval);
    document.addEventListener("visibilitychange", refreshIfDue);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfDue);
    };
  }, []);

  return (
    <section id="projects" className="relative section-pad overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <p className="mb-2 font-mono text-body text-accent">$ ls ~/projects</p>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-mono text-xl font-medium leading-8 text-slate-900 sm:text-2xl">Things I&apos;m building.</h2>
              <p className="mt-3 max-w-[68ch] font-mono text-body text-ink-400">Systems, experiments, and ideas that made it into code.</p>
            </div>
            <a href={`${personal.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-body text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent">
              [all repositories]
            </a>
          </div>
        </AnimatedSection>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <AnimatedSection key={project.title} delay={index * 0.08}>
              <article className="flex h-full flex-col border-t border-accent/25 py-5 font-mono">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-caption text-ink-400">
                  <span className="text-accent">selected build</span>
                  <span>{project.date}</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">{project.title}</h3>
                <p className="mt-1 text-caption text-accent">{project.subtitle}</p>
                <p className="mt-4 flex-1 text-body text-slate-700">{project.description}</p>
                <p className="mt-5 text-caption leading-6 text-ink-400">{project.tech.join(" / ")}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-accent/25 pb-4">
          <h3 className="font-mono text-body font-medium text-slate-900">Latest on GitHub</h3>
          <p role="status" aria-live="polite" className="font-mono text-caption text-ink-400">
            {loading ? "Fetching repositories…" : unavailable ? (github ? "Showing last fetched repositories" : "GitHub is temporarily unavailable") : github ? `Synced ${dateLabel(github.fetchedAt)} · updates hourly` : ""}
          </p>
        </div>

        {github && (
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {github.projects.map((project) => (
              <article key={project.id} className="flex min-w-0 flex-col border-b border-accent/20 pb-5 font-mono">
                <h4 className="break-words text-body font-medium text-accent">
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent">{project.name}</a>
                </h4>
                <p className="mt-3 flex-1 text-body text-slate-700">{project.description || "Explore the source, commits, and latest progress on GitHub."}</p>
                {project.topics.length > 0 && <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-caption text-accent">{project.topics.map((topic) => <span key={topic}>#{topic}</span>)}</div>}
                <p className="mt-4 text-caption text-ink-400">stars: {project.stars} / forks: {project.forks}</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-caption text-ink-400">
                  {project.language && <span>{project.language}</span>}
                  <span>Updated {dateLabel(project.updatedAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && (!github || github.projects.length === 0) && <p className="py-3 font-mono text-body text-slate-700">{unavailable ? "The selected builds above are always available. " : "No public repositories to show yet. "}<a href={personal.github} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">Visit my GitHub</a> to explore more.</p>}
      </div>
    </section>
  );
}
