"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { education, experiences, personal, projects, skillCategories } from "@/lib/data";
import { PROJECT_REFRESH_SECONDS, isGitHubProjectsResponse } from "@/lib/github-projects";
import { SPOTIFY_REFRESH_SECONDS, type SpotifyBeatsResponse } from "@/lib/spotify-beats";
import type { TerminalTopic } from "@/lib/portfolio-terminal";
import ProfileSummary from "@/components/terminal/ProfileSummary";

type Props = { topic: TerminalTopic; onCommand?: (command: string, focusInput?: boolean) => void };
type PollingResult<T> = { data: T | null; loading: boolean; unavailable: boolean };

// The transcript may contain several instances of a live output. Share requests
// and successful responses so printing it again does not multiply API traffic.
// Each shared request owns its timeout; unmounting one output must not cancel it
// for the others. Individual effects ignore completed work after unmounting.
const outputCache = new Map<string, { data: unknown; expiresAt: number }>();
const outputRequests = new Map<string, Promise<unknown>>();
const outputFailures = new Map<string, { retryAt: number; attempts: number }>();
const STALE_OUTPUT_RETRY_MS = 15_000;

async function requestOutputData<T>(url: string, seconds: number, validate: (value: unknown) => value is T): Promise<T> {
  const cached = outputCache.get(url);
  if (cached && cached.expiresAt > Date.now() && validate(cached.data)) return cached.data;
  const failure = outputFailures.get(url);
  if (failure && failure.retryAt > Date.now()) throw new Error("Output unavailable");
  const pending = outputRequests.get(url);
  if (pending) {
    const result = await pending;
    if (!validate(result)) throw new Error("Invalid output");
    return result;
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18000);
  const request = (async () => {
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("Output unavailable");
      const result: unknown = await response.json();
      if (!validate(result)) throw new Error("Invalid output");
      const fetchedAt = result && typeof result === "object" && "fetchedAt" in result && typeof result.fetchedAt === "string"
        ? Date.parse(result.fetchedAt) : NaN;
      const now = Date.now();
      // A stale-while-revalidate server response must not gain a fresh full TTL.
      // Give the server a short shared window to finish revalidation, then retry.
      const freshUntil = (Number.isFinite(fetchedAt) ? Math.min(now, fetchedAt) : now) + seconds * 1000;
      outputCache.set(url, { data: result, expiresAt: Math.max(now + STALE_OUTPUT_RETRY_MS, freshUntil) });
      outputFailures.delete(url);
      return result;
    } catch (error) {
      const attempts = Math.min((outputFailures.get(url)?.attempts || 0) + 1, 5);
      const delay = Math.min(seconds * 1000, 5 * 60_000, 30_000 * 2 ** (attempts - 1));
      outputFailures.set(url, { attempts, retryAt: Date.now() + delay });
      throw error;
    }
  })();
  outputRequests.set(url, request);
  try {
    return await request;
  } finally {
    window.clearTimeout(timeout);
    if (outputRequests.get(url) === request) outputRequests.delete(url);
  }
}

function focusCommandInput(event: MouseEvent<HTMLButtonElement>) {
  return event.detail > 0 && window.matchMedia("(pointer: fine)").matches;
}

function useOutputData<T>(url: string, seconds: number, validate: (value: unknown) => value is T): PollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let inFlight = false;
    let refreshTimer: number | undefined;
    let nextRefreshAt = 0;
    const schedule = () => {
      window.clearTimeout(refreshTimer);
      if (!active) return;
      refreshTimer = window.setTimeout(() => {
        if (document.visibilityState === "visible") void refresh();
      }, Math.max(1000, nextRefreshAt - Date.now()));
    };
    const refresh = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const result = await requestOutputData(url, seconds, validate);
        if (active) { setData(result); setUnavailable(false); }
      } catch {
        if (active) setUnavailable(true);
      } finally {
        inFlight = false;
        if (active) {
          setLoading(false);
          nextRefreshAt = outputFailures.get(url)?.retryAt ?? outputCache.get(url)?.expiresAt ?? Date.now() + seconds * 1000;
          schedule();
        }
      }
    };
    const refreshIfDue = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() >= nextRefreshAt) void refresh();
      else schedule();
    };
    void refresh();
    document.addEventListener("visibilitychange", refreshIfDue);
    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", refreshIfDue);
    };
  }, [url, seconds, validate]);

  return { data, loading, unavailable };
}

function isSpotifyData(value: unknown): value is SpotifyBeatsResponse {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<SpotifyBeatsResponse>;
  if (result.status === "disconnected" || result.status === "unavailable") return typeof result.message === "string";
  return result.status === "connected" && typeof result.historyLimit === "number" &&
    typeof result.fetchedAt === "string" && Number.isFinite(Date.parse(result.fetchedAt)) &&
    Array.isArray(result.tracks) && result.tracks.every(track => track &&
      typeof track.id === "string" && typeof track.title === "string" &&
      typeof track.url === "string" && /^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]{22}$/.test(track.url) &&
      Array.isArray(track.artists) && track.artists.every(artist => typeof artist === "string") &&
      typeof track.observedPlays === "number");
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
}

function Link({ href, children, download = false }: { href: string; children: ReactNode; download?: boolean }) {
  const external = href.startsWith("https://");
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} download={download || undefined} className="tty-link break-words">{children}</a>;
}

const commandList = [
  ["skills", "Languages, systems, and tools"],
  ["experience", "Work experience"],
  ["projects", "Projects and GitHub"],
  ["flashfs", "Distributed filesystem"],
  ["education", "Schools and studies"],
  ["travel", "Travel"],
  ["offtofly", "Travel-planning project"],
  ["beats", "Spotify listening"],
  ["contact", "Get in touch"],
  ["links", "Social profiles"],
  ["resume", "Download PDF"],
] as const;

function HelpOutput({ onCommand }: Pick<Props, "onCommand">) {
  return <div className="space-y-3">
    <p>Type a topic name, such as skills, or select it below.</p>
    <dl className="grid grid-cols-[11ch_minmax(0,1fr)] gap-x-3 gap-y-1">
      {commandList.map(([command, description]) => <div key={command} className="contents">
        <dt>{onCommand ? <button type="button" onClick={event => onCommand(command, focusCommandInput(event))} className="tty-link text-left">{command}</button> : <span className="text-accent">{command}</span>}</dt>
        <dd>{description}</dd>
      </div>)}
    </dl>
    <p className="text-ink-400">back / undo: previous view · home: first screen · clear: clear output</p>
    <p className="text-ink-400">Tab completes names. Up/Down recalls commands. Ctrl+L clears the display.</p>
    <p className="text-ink-400">Shell navigation: cd skills, ls, cat README.md, cd .., cd -, cd ~.</p>
    <p className="text-ink-400">Font: <Link href="/fonts/README.txt">WebPlus IBM VGA 8x16 by VileR</Link> · CC BY-SA 4.0.</p>
  </div>;
}

function ProjectsOutput() {
  const { data, loading, unavailable } = useOutputData("/api/github/projects", PROJECT_REFRESH_SECONDS, isGitHubProjectsResponse);
  return <div className="space-y-5">
    <p className="text-accent">Selected projects</p>
    {projects.map(project => <div key={project.title} className="space-y-1">
      <p className="text-accent">{project.title} — {project.subtitle}</p>
      <p className="text-ink-400">{project.date}</p>
      <p>{project.summary}</p>
      <p className="text-ink-400">{project.tech.join(" / ")}</p>
    </div>)}
    <div className="space-y-3">
      <p className="text-accent">Latest public repositories</p>
      {loading && <p role="status">Fetching GitHub repositories…</p>}
      {unavailable && <p role="status" className="text-ink-400">{data ? "Showing the last fetched repositories. " : ""}GitHub is temporarily unavailable. The selected projects above remain available.</p>}
      {data && data.projects.map(project => <div key={project.id} className="space-y-1">
        <p><Link href={project.url}>{project.name}</Link></p>
        {project.description && <p>{project.description}</p>}
        <p className="text-ink-400">{project.language || "Source"} · {project.stars} stars · {project.forks} forks · updated {dateLabel(project.updatedAt)}</p>
      </div>)}
      {data && data.projects.length === 0 && <p>No active public repositories to display.</p>}
      {data && <p className="text-ink-400">Fetched {dateLabel(data.fetchedAt)}. Refreshes hourly.</p>}
      <p><Link href={`${personal.github}?tab=repositories`}>All repositories on GitHub</Link></p>
    </div>
  </div>;
}

function BeatsOutput() {
  const { data, loading, unavailable } = useOutputData("/api/spotify/beats", SPOTIFY_REFRESH_SECONDS, isSpotifyData);
  const connected = data?.status === "connected" ? data : null;
  return <div className="space-y-3">
    <p className="text-accent">Beats / this week</p>
    {loading && <p role="status">Reading Spotify listening history…</p>}
    {unavailable && <p role="status">{connected ? "Showing the last listening snapshot. " : ""}Spotify is temporarily unavailable.</p>}
    {data?.status === "disconnected" && <p role="status">Spotify is not connected yet. My listening history will appear after I connect my account.</p>}
    {data?.status === "unavailable" && <p role="status">Spotify listening history is temporarily unavailable.</p>}
    {connected && connected.tracks.length === 0 && <p>No recent plays in this week&apos;s snapshot yet.</p>}
    {connected && <>
      <ol className="space-y-3">
        {connected.tracks.map(track => <li key={track.id} className="space-y-1">
          <p><Link href={track.url}>{track.title}</Link></p>
          <p className="text-ink-400">{track.artists.join(", ") || "Artist unavailable"} · {track.observedPlays} observed {track.observedPlays === 1 ? "play" : "plays"}</p>
        </li>)}
      </ol>
      <p className="text-ink-400">A snapshot of Spotify&apos;s {connected.historyLimit} most recent plays, filtered from Monday in Nashville. Counts describe this sample, not a complete weekly chart. Updates every five minutes.</p>
    </>}
    <p><Link href="https://open.spotify.com/">Listen on Spotify</Link></p>
  </div>;
}

function LinksOutput() {
  return <dl className="grid grid-cols-[10ch_minmax(0,1fr)] gap-x-3 gap-y-2">
    {[
      ["github", personal.github], ["linkedin", personal.linkedin],
      ["instagram", personal.instagram], ["email", `mailto:${personal.email}`],
    ].map(([label, href]) => <div key={label} className="contents"><dt className="text-ink-400">{label}</dt><dd className="min-w-0 break-all"><Link href={href}>{href.replace(/^https:\/\//, "").replace(/^mailto:/, "")}</Link></dd></div>)}
    <dt className="text-ink-400">resume</dt><dd><Link href="/assets/resume/resume_jhadhiraj147.pdf" download>resume.pdf</Link></dd>
  </dl>;
}

export default function TerminalOutput({ topic, onCommand }: Props) {
  let output: ReactNode;
  switch (topic) {
    case "welcome":
    case "about":
      output = <div className="space-y-5"><ProfileSummary /><p>{personal.bio}</p></div>;
      break;
    case "skills":
      output = <div className="space-y-3">{skillCategories.map(category => <div key={category.label}><p className="text-accent">{category.label}</p><p>{category.skills.join(" / ")}</p></div>)}</div>;
      break;
    case "experience":
      output = <div className="space-y-5">{experiences.map(company => <div key={company.id} className="space-y-3"><p className="text-accent">{company.company} · {company.location}</p>{company.roles.map(role => <div key={role.title} className="space-y-1"><p>{role.title} / {role.period}</p><p>{role.description}</p>{"note" in role && role.note && <p className="text-ink-400">{role.note}</p>}</div>)}</div>)}</div>;
      break;
    case "projects":
      output = <ProjectsOutput />;
      break;
    case "flashfs":
      output = <div className="space-y-3"><p className="text-accent">FlashFS / distributed filesystem</p><p>Files live on your laptops as chunks. The cloud holds metadata; file bytes travel directly between laptops.</p><p>The metadata core in flashfs-master is synchronous and authoritative. An asynchronous optimizer proposes replica placement changes. Each laptop runs a FUSE client-daemon and a node-daemon that stores and verifies chunks.</p><p>Metadata travels over gRPC with mTLS. Chunk transfers use direct connections, with ICE for NAT traversal. Writes use leases, SHA-256 chunk names, replication acknowledgements, and an atomic metadata transaction.</p><p><Link href="https://github.com/jhadhiraj147/FlashFS">github.com/jhadhiraj147/FlashFS</Link></p></div>;
      break;
    case "education":
      output = <div className="space-y-5">{education.map(school => <div key={school.school} className="space-y-1"><p className="text-accent">{school.school} / {school.period}</p><p>{school.degrees.join("; ")} · {school.location}</p>{school.graduation && <p className="text-ink-400">Graduation: {school.graduation}</p>}{school.highlights.length > 0 && <p>{school.highlights.map(highlight => `${highlight.label}: ${highlight.sub}`).join(" / ")}</p>}<p className="text-ink-400">Coursework: {school.courses.join(", ")}</p></div>)}</div>;
      break;
    case "travel":
      output = <div className="space-y-3"><p className="text-accent">A Nepali passport / Nepal to Nashville</p><p>I have visited Nepal, India, the United States, Turkey, Bahrain, the Philippines, the UAE, and Puerto Rico.</p><p>Planning travel as an international student means weighing routes, layovers, visas, and cost. Managing trips across too many tabs and apps helped inspire offtofly.</p>{onCommand && <p><button type="button" className="tty-link" onClick={event => onCommand("offtofly", focusCommandInput(event))}>offtofly</button></p>}</div>;
      break;
    case "offtofly": {
      const role = experiences.find(company => company.id === "offtofly")?.roles[0];
      output = <div className="space-y-3"><p className="text-accent">offtofly / {role?.title || "Travel planning"}</p>{role && <><p className="text-ink-400">{role.period}</p><p>{role.description}</p>{"note" in role && <p>{role.note}</p>}</>}<p><Link href="https://offtofly.com">offtofly.com</Link></p></div>;
      break;
    }
    case "beats":
      output = <BeatsOutput />;
      break;
    case "contact":
      output = <div className="space-y-3"><p>Open to internships, collaboration on projects, and good conversations.</p><p><Link href={`mailto:${personal.email}`}>{personal.email}</Link></p><p>{personal.location}</p></div>;
      break;
    case "links":
      output = <LinksOutput />;
      break;
    case "help":
    default:
      output = <HelpOutput onCommand={onCommand} />;
  }
  return <div className="min-w-0 max-w-[82ch] space-y-3 break-words text-inherit">{output}</div>;
}
