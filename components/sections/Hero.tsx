"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import TerminalOutput from "@/components/terminal/TerminalOutput";
import ProfileSummary from "@/components/terminal/ProfileSummary";
import { personal } from "@/lib/data";
import {
  completeTerminalInput,
  resolveTerminalCommand,
  normalizeTerminalInput,
  TERMINAL_USERNAME,
  TERMINAL_HOSTNAME,
  type TerminalDirectory,
  type TerminalResult,
} from "@/lib/portfolio-terminal";

type Entry = { id: number; command: string; directory: TerminalDirectory; result: TerminalResult };
type TerminalView = {
  directory: TerminalDirectory;
  previousDirectory?: TerminalDirectory;
  entries: Entry[];
  showWelcome: boolean;
  scrollTop: number;
};
const shortcuts = ["back", "home", "help", "projects", "experience", "resume", "clear"] as const;
const destinations = {
  resume: "/assets/resume/resume_jhadhiraj147.pdf",
  github: personal.github,
  linkedin: personal.linkedin,
  instagram: personal.instagram,
  email: `mailto:${personal.email}`,
};

function Prompt({ directory }: { directory: TerminalDirectory }) {
  return <span className="text-accent">[{TERMINAL_USERNAME}<span className="text-ink-400">@</span>{TERMINAL_HOSTNAME} <span className="text-ink-400">{directory}</span>]$</span>;
}

export default function Hero() {
  const [directory, setDirectory] = useState<TerminalDirectory>("~");
  const [previousDirectory, setPreviousDirectory] = useState<TerminalDirectory>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [value, setValue] = useState("");
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIndex, setRecallIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [completions, setCompletions] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<TerminalView[]>([]);
  const [navigationStatus, setNavigationStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollbackRef = useRef<HTMLDivElement>(null);
  const lastEntryRef = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const restoredScrollTop = useRef<number | null>(null);
  const scrollRestoreDeadline = useRef(0);
  const lastEntryId = entries[entries.length - 1]?.id;
  const isCleared = !showWelcome && entries.length === 0;
  const Banner = showWelcome ? "p" : "h1";

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const area = scrollbackRef.current;
    const content = area?.firstElementChild;
    if (!area || !content) return;
    // A restored GitHub/Spotify output can grow after its request completes.
    const restore = () => {
      const target = restoredScrollTop.current;
      if (target === null) return;
      if (Date.now() > scrollRestoreDeadline.current) { restoredScrollTop.current = null; return; }
      area.scrollTo({ top: target, behavior: "instant" });
      if (area.scrollHeight - area.clientHeight >= target - 1) restoredScrollTop.current = null;
    };
    const cancel = () => { restoredScrollTop.current = null; };
    const observer = new ResizeObserver(restore);
    observer.observe(content);
    area.addEventListener("wheel", cancel, { passive: true });
    area.addEventListener("touchstart", cancel, { passive: true });
    area.addEventListener("pointerdown", cancel, { passive: true });
    return () => {
      observer.disconnect();
      area.removeEventListener("wheel", cancel);
      area.removeEventListener("touchstart", cancel);
      area.removeEventListener("pointerdown", cancel);
    };
  }, []);

  useEffect(() => {
    const area = scrollbackRef.current;
    const last = lastEntryRef.current;
    if (area && restoredScrollTop.current !== null) {
      const target = restoredScrollTop.current;
      area.scrollTo({ top: target, behavior: "instant" });
      if (area.scrollHeight - area.clientHeight >= target - 1) restoredScrollTop.current = null;
    } else if (area && last) {
      const top = last.getBoundingClientRect().top - area.getBoundingClientRect().top + area.scrollTop;
      area.scrollTo({ top, behavior: "instant" });
    } else if (area) area.scrollTop = 0;
  }, [lastEntryId, showWelcome, viewHistory.length]);

  const rememberView = () => {
    const view: TerminalView = {
      directory, previousDirectory, entries, showWelcome,
      scrollTop: scrollbackRef.current?.scrollTop || 0,
    };
    setViewHistory(previous => [...previous.slice(-29), view]);
  };

  const restoreView = () => {
    const previous = viewHistory[viewHistory.length - 1];
    if (!previous) { setNavigationStatus("Already at the first view."); return; }
    restoredScrollTop.current = previous.scrollTop;
    scrollRestoreDeadline.current = Date.now() + 20000;
    setDirectory(previous.directory);
    setPreviousDirectory(previous.previousDirectory);
    setEntries(previous.entries);
    setShowWelcome(previous.showWelcome);
    setViewHistory(history => history.slice(0, -1));
    setNavigationStatus("Previous terminal view restored.");
  };

  const clear = (saveView = true) => {
    if (saveView && (entries.length || showWelcome)) rememberView();
    restoredScrollTop.current = null;
    setEntries([]);
    setShowWelcome(false);
    setValue("");
    setCompletions([]);
    setRecallIndex(recall.length);
    setDraft("");
  };

  const runCommand = (rawInput: string, focusInput = true) => {
    const command = rawInput.trim();
    const normalizedCommand = normalizeTerminalInput(command);
    const result = resolveTerminalCommand(command, directory, previousDirectory);
    if (result.kind === "noop") return;
    if (result.kind !== "back") restoredScrollTop.current = null;
    const resetHome = result.kind === "directory" && normalizedCommand === "home";
    const unchangedHome = resetHome && directory === "~" && !entries.length && showWelcome;
    const unchangedClear = result.kind === "clear" && !entries.length && !showWelcome;
    if (result.kind !== "back" && !unchangedHome && !unchangedClear) rememberView();
    setNavigationStatus("");
    if (result.kind === "directory" && !unchangedHome) {
      setPreviousDirectory(directory);
      setDirectory(result.directory);
    }
    if (result.kind === "back") restoreView();
    else if (result.kind === "clear") clear(false);
    else if (resetHome) {
      setEntries([]);
      setShowWelcome(true);
    }
    else {
      if (result.kind === "open") {
        const url = destinations[result.target];
        if (result.target === "email") window.location.href = url;
        else window.open(url, "_blank", "noopener,noreferrer");
      }
      setEntries(previous => [...previous.slice(-99), { id: ++sequence.current, command, directory, result }]);
    }
    const nextRecall = [...recall.slice(-99), command];
    setRecall(nextRecall);
    setRecallIndex(nextRecall.length);
    setValue("");
    setDraft("");
    setCompletions([]);
    if (focusInput) inputRef.current?.focus({ preventScroll: true });
    else inputRef.current?.blur();
  };

  const submit = (event: FormEvent) => { event.preventDefault(); runCommand(value); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter and arrow keys can commit an IME composition; don't treat those as
    // terminal shortcuts. Browsers also use keyCode 229 for this on some IMEs.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault(); clear();
    } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
      const input = event.currentTarget;
      if (input.selectionStart !== input.selectionEnd) return;
      event.preventDefault();
      restoredScrollTop.current = null;
      rememberView();
      setEntries(previous => [...previous.slice(-99), {
        id: ++sequence.current, command: `${value}^C`, directory,
        result: { kind: "noop" },
      }]);
      setValue(""); setDraft(""); setCompletions([]); setRecallIndex(recall.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!recall.length) return;
      if (event.key === "ArrowDown" && recallIndex === recall.length) return;
      if (recallIndex === recall.length) setDraft(value);
      const next = Math.max(0, Math.min(recall.length, recallIndex + (event.key === "ArrowUp" ? -1 : 1)));
      setRecallIndex(next);
      setValue(next === recall.length ? draft : recall[next] || "");
      setCompletions([]);
    } else if (event.key === "Tab" && !event.shiftKey) {
      const matches = completeTerminalInput(value, directory);
      if (matches.length === 1) { event.preventDefault(); setValue(matches[0]); setCompletions([]); }
      else if (matches.length > 1) { event.preventDefault(); setCompletions(matches); }
    } else if (event.key === "Escape") {
      setCompletions([]);
      event.currentTarget.blur();
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      restoredScrollTop.current = null;
      const area = scrollbackRef.current;
      if (area) area.scrollBy({ top: area.clientHeight * (event.key === "PageUp" ? -0.8 : 0.8), behavior: "instant" });
    }
  };

  return (
    <section id="terminal" className="terminal-shell" aria-label="Dhiraj Jha portfolio terminal">
      <div ref={scrollbackRef} className={`terminal-scrollback${isCleared ? " terminal-scrollback-cleared" : ""}`} tabIndex={0} role="region" aria-label="Terminal scrollback">
        <div className="terminal-content" role="log" aria-live="polite" aria-relevant="additions">
          <div className="terminal-login">
            <Banner className="text-ink-400">Arch Linux tty1</Banner>
            <p className="text-ink-400">{TERMINAL_HOSTNAME} login: <span className="text-slate-900">{TERMINAL_USERNAME}</span></p>
          </div>
          {showWelcome && <div className="terminal-welcome">
            <p className="mt-3"><Prompt directory="~" /> <span className="text-slate-900">home</span></p>
            <div className="mt-3"><ProfileSummary heading="h1" /></div>
          </div>}

          {entries.map((entry, index) => <div key={entry.id} ref={index === entries.length - 1 ? lastEntryRef : undefined} className="terminal-entry">
            <p className="break-words"><Prompt directory={entry.directory} /> <span className="text-slate-900">{entry.command}</span></p>
            <div className={(entry.result.kind === "directory" && !entry.result.output) || entry.result.kind === "noop" ? "hidden" : "mt-3 text-slate-700"}>
              {entry.result.kind === "content" && <TerminalOutput topic={entry.result.topic} onCommand={runCommand} />}
              {entry.result.kind === "directory" && entry.result.output && <p className="whitespace-pre-wrap break-words">{entry.result.output}</p>}
              {entry.result.kind === "text" && <p className="whitespace-pre-wrap break-words">{entry.result.text}{normalizeTerminalInput(entry.command) === "credits" && <> <a href="/fonts/README.txt" target="_blank" rel="noopener noreferrer" className="tty-link">[font attribution]</a></>}</p>}
              {entry.result.kind === "open" && <p>
                {entry.result.target === "email" ? "Opening your email app." : `Opening ${entry.result.target} in a new tab.`}{" "}
                <a href={destinations[entry.result.target]} target={entry.result.target === "email" ? undefined : "_blank"} rel={entry.result.target === "email" ? undefined : "noopener noreferrer"} download={entry.result.target === "resume" || undefined} className="tty-link">{entry.result.target === "resume" ? "[download PDF]" : `[open ${entry.result.target}]`}</a>
              </p>}
            </div>
          </div>)}
        </div>
      </div>

      <div className="terminal-input-area">
        {completions.length > 1 && <p role="status" className="mb-2 break-words text-ink-400">{completions.join("   ")}</p>}
        <form onSubmit={submit} className="terminal-prompt" aria-label="Portfolio terminal">
          <label htmlFor="terminal-command" className="whitespace-nowrap" aria-hidden="true"><Prompt directory={directory} /></label>
          <input ref={inputRef} id="terminal-command" value={value} onChange={event => { setValue(event.target.value); setCompletions([]); }} onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="none" spellCheck={false} enterKeyHint="send" aria-label="Portfolio command" aria-describedby="terminal-help" maxLength={256} placeholder="type command here | type <help> for all commands!" className="tty-command" />
          <button type="submit" aria-label="Run command" className="text-ink-400 hover:text-accent">[enter]</button>
        </form>
        <p id="terminal-help" className="sr-only">Type a command and press Enter, or select a shortcut. Back restores the previous terminal view.</p>
        <p role="status" aria-live="polite" className="sr-only">{navigationStatus}</p>
        <nav aria-label="Terminal shortcuts" className="terminal-shortcuts">
          {shortcuts.map(command => <button
            key={command}
            type="button"
            aria-label={`Run ${command} command`}
            disabled={command === "back" && viewHistory.length === 0}
            title={command === "back" ? "Undo the last terminal view change" : undefined}
            onClick={event => runCommand(command, event.detail > 0 && window.matchMedia("(pointer: fine)").matches)}
            className="tty-link disabled:cursor-default disabled:opacity-40"
          >[{command}]</button>)}
        </nav>
      </div>
    </section>
  );
}
