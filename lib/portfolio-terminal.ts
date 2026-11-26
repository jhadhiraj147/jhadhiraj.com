/** A small virtual portfolio filesystem. No command reaches an operating-system shell. */
export const TERMINAL_USERNAME = "jhadhiraj147";
export const TERMINAL_HOSTNAME = "archlinux";
export const TERMINAL_HOME = `/home/${TERMINAL_USERNAME}`;

export const TERMINAL_SECTIONS = [
  "about", "skills", "experience", "projects", "flashfs", "education",
  "travel", "offtofly", "beats", "contact", "links",
] as const;
export const VISIBLE_TERMINAL_SECTIONS = TERMINAL_SECTIONS.filter(section => section !== "about");
export type TerminalSection = typeof TERMINAL_SECTIONS[number];
export type TerminalTopic = TerminalSection | "welcome" | "help";
export type TerminalDirectory = "~" | `~/${TerminalSection}`;
export type TerminalOpenTarget = "resume" | "github" | "linkedin" | "email" | "instagram";
export type TerminalResult =
  | { kind: "content"; topic: TerminalTopic }
  | { kind: "directory"; directory: TerminalDirectory; output?: string }
  | { kind: "back" }
  | { kind: "clear" }
  | { kind: "open"; target: TerminalOpenTarget }
  | { kind: "text"; text: string }
  | { kind: "noop" };

export const TERMINAL_COMMANDS = [
  ...VISIBLE_TERMINAL_SECTIONS, "help", "whoami", "home", "back", "undo", "cd", "ls", "pwd", "cat",
  "resume", "github", "linkedin", "email", "instagram", "open", "clear", "credits",
] as const;

const aliases: Record<string, TerminalTopic> = {
  stack: "skills", work: "experience", jobs: "experience",
  code: "projects", repos: "projects", study: "education", passport: "travel",
  music: "beats", spotify: "beats", socials: "links", welcome: "welcome", "?": "help",
};
const fileTopics: Record<string, TerminalTopic> = {
  "about.txt": "about", "about.md": "about", "skills.txt": "skills", "stack.conf": "skills",
  "experience.log": "experience", "experience.txt": "experience", "projects.md": "projects",
  "flashfs.md": "flashfs", "education.md": "education", "travel.log": "travel",
  "offtofly.md": "offtofly", "beats.log": "beats", "contact.txt": "contact", "links.txt": "links",
};
const primaryFiles: Record<TerminalSection, string> = {
  about: "about.txt", skills: "skills.txt", experience: "experience.log", projects: "projects.md",
  flashfs: "flashfs.md", education: "education.md", travel: "travel.log", offtofly: "offtofly.md",
  beats: "beats.log", contact: "contact.txt", links: "links.txt",
};
const openTargets = new Set<string>(["resume", "github", "linkedin", "email", "instagram"]);
const sectionSet = new Set<string>(TERMINAL_SECTIONS);
const owns = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);
const cleanDirectory = (directory: string): TerminalDirectory =>
  directory === "~" || (directory.startsWith("~/") && sectionSet.has(directory.slice(2)))
    ? directory as TerminalDirectory : "~";
const directoryTopic = (directory: TerminalDirectory): TerminalTopic =>
  directory === "~" ? "welcome" : directory.slice(2) as TerminalSection;
const text = (message: string): TerminalResult => ({ kind: "text", text: message });
const usage = (command: string) => text(`Usage: ${command}`);

const commandWrappers: Record<string, string> = {
  '"': '"', "'": "'", "[": "]", "<": ">", "“": "”", "‘": "’",
};

function unwrapCommandPart(input: string): string {
  let value = input.trim();
  while (value.length >= 2) {
    const opening = value[0];
    const closing = commandWrappers[opening];
    if (!closing || !value.endsWith(closing)) break;
    if (opening === closing || opening === "“" || opening === "‘") {
      if (value.indexOf(closing, 1) !== value.length - 1) break;
    } else {
      let depth = 0;
      let fullyWrapped = false;
      for (let index = 0; index < value.length; index++) {
        if (value[index] === opening) depth++;
        else if (value[index] === closing) depth--;
        if (depth === 0) { fullyWrapped = index === value.length - 1; break; }
      }
      if (!fullyWrapped) break;
    }
    value = value.slice(1, -1).trim();
  }
  return value;
}

/** Accept copied display wrappers while preserving whitespace for command validation. */
export function normalizeTerminalInput(input: string): string {
  return unwrapCommandPart(input).replace(/\S+/g, token => unwrapCommandPart(token));
}

/** Normalize paths only inside the virtual home; there are no real files to traverse. */
function virtualPath(value: string, current: TerminalDirectory): string | null {
  let path = value;
  let parts = current === "~" ? [] : [current.slice(2)];
  if (path === "~" || path === TERMINAL_HOME) return "~";
  if (path.startsWith(`${TERMINAL_HOME}/`)) { parts = []; path = path.slice(TERMINAL_HOME.length + 1); }
  else if (path.startsWith("~/")) { parts = []; path = path.slice(2); }
  else if (path.startsWith("/")) return null;
  for (const part of path.split("/")) {
    if (!part) continue;
    // Every intermediate component must actually be a virtual directory.
    // Lexically collapsing missing/.. or file/.. would otherwise invent paths.
    if (parts.length && !(parts.length === 1 && sectionSet.has(parts[0]))) return null;
    if (part === ".") continue;
    if (part === "..") {
      if (!parts.length) {
        if (/^\.\.\/?$/.test(path)) continue;
        return null;
      }
      parts.pop();
    } else parts.push(part);
  }
  return parts.length ? `~/${parts.join("/")}` : "~";
}
function asDirectory(value: string, current: TerminalDirectory): TerminalDirectory | null {
  const path = virtualPath(value, current);
  return path && (path === "~" || (path.startsWith("~/") && sectionSet.has(path.slice(2))))
    ? path as TerminalDirectory : null;
}
function filesIn(directory: TerminalDirectory): string[] {
  if (directory === "~") return ["README.md", ...Object.values(primaryFiles), "resume.pdf"];
  const topic = directory.slice(2) as TerminalSection;
  return ["README.md", primaryFiles[topic],
    ...(topic === "projects" ? ["flashfs.md", "offtofly.md"] : [])];
}
function readableFiles(directory: TerminalDirectory): string[] {
  if (directory === "~") return ["README.md", ...Object.keys(fileTopics), "resume.pdf"];
  const topic = directoryTopic(directory);
  return [...filesIn(directory), ...Object.keys(fileTopics).filter(file => fileTopics[file] === topic)];
}
function completionFilesIn(directory: TerminalDirectory): string[] {
  return directory === "~/about" ? [] : filesIn(directory).filter(file => fileTopics[file] !== "about");
}
function readFile(path: string, current: TerminalDirectory): TerminalResult {
  const normalized = virtualPath(path, current);
  if (!normalized) return text(`cat: ${path}: no such file`);
  if (asDirectory(path, current)) return text(`cat: ${path}: is a directory. Use cd or ls.`);
  if (path.endsWith("/")) return text(`cat: ${path}: not a directory`);
  const slash = normalized.lastIndexOf("/");
  const parent = normalized.slice(0, slash);
  const filename = normalized.slice(slash + 1);
  const directory = asDirectory(parent, "~");
  if (!directory || !readableFiles(directory).includes(filename)) return text(`cat: ${path}: no such file`);
  if (filename === "README.md") return { kind: "content", topic: directoryTopic(directory) };
  if (filename === "resume.pdf") return { kind: "open", target: "resume" };
  return { kind: "content", topic: fileTopics[filename] };
}

export function resolveTerminalCommand(input: string, currentDirectory: string = "~", previousDirectory?: string): TerminalResult {
  const current = cleanDirectory(currentDirectory);
  const original = input.trim();
  if (!original) return { kind: "noop" };
  if (original.length > 256) return text("Command is too long. Type help for available commands.");
  if (/[\r\n\x00-\x1f]/.test(original)) return text("Use one portfolio command at a time. Type help for available commands.");
  const commandLine = normalizeTerminalInput(original);
  if (!commandLine) return { kind: "noop" };
  if (/[;|&<>`\\\r\n\x00-\x1f]/.test(commandLine)) return text("Use one portfolio command at a time. Type help for available commands.");
  const [rawCommand, ...args] = commandLine.split(/\s+/);
  const command = rawCommand;
  if (command === "cd" || command === "home") {
    if (args.length > (command === "cd" ? 1 : 0)) return usage(command === "cd" ? "cd [section/ | ~ | .. | -]" : `${command} (no arguments)`);
    const target = command === "home" ? "~" : args[0] || "~";
    if (target === "-") {
      if (!previousDirectory || cleanDirectory(previousDirectory) !== previousDirectory) return text("cd: OLDPWD not set");
      const directory = previousDirectory as TerminalDirectory;
      return { kind: "directory", directory, output: directory.replace(/^~/, TERMINAL_HOME) };
    }
    const directory = asDirectory(target, current);
    return directory ? { kind: "directory", directory }
      : text(`cd: ${target}: no such directory. Use ls to see available sections.`);
  }
  if (command === "cat") return args.length === 1 ? readFile(args[0], current) : usage("cat <file>");
  if (command === "ls") {
    const paths = args.filter(arg => !["-a", "-l", "-la", "-al"].includes(arg));
    if (paths.length > 1 || paths.some(path => path.startsWith("-"))) return usage("ls [section/]");
    const directory = paths.length ? asDirectory(paths[0], current) : current;
    if (!directory) return text(`ls: ${paths[0]}: no such directory`);
    if (directory === "~") return text(VISIBLE_TERMINAL_SECTIONS.join("  "));
    const entries = [
      ...(args.some(arg => ["-a", "-la", "-al"].includes(arg)) ? [".", ".."] : []),
      ...filesIn(directory),
    ];
    return text(entries.join("  "));
  }
  if (command === "open") {
    const target = args[0]?.replace(/\.pdf$/, "");
    return args.length === 1 && openTargets.has(target) ? { kind: "open", target: target as TerminalOpenTarget }
      : usage("open <resume | github | linkedin | email | instagram>");
  }
  if (args.length) return TERMINAL_COMMANDS.some(value => value === command) || sectionSet.has(command) || owns(aliases, command)
    ? usage(`${command} (no arguments)`)
    : text(`Command not found: ${rawCommand}. Type help for available commands.`);
  if (command === "pwd") return text(current.replace(/^~/, TERMINAL_HOME));
  if (command === "whoami") return text(TERMINAL_USERNAME);
  if (command === "clear") return { kind: "clear" };
  if (command === "back" || command === "undo") return { kind: "back" };
  if (command === "credits") return text("Console font: WebPlus IBM VGA 8x16 by VileR. CC BY-SA 4.0. Attribution and license: /fonts/README.txt (classic VGA 8x16 console glyphs).");
  if (openTargets.has(command)) return { kind: "open", target: command as TerminalOpenTarget };
  if (sectionSet.has(command)) return { kind: "content", topic: command as TerminalSection };
  if (command === "help") return { kind: "content", topic: "help" };
  if (owns(aliases, command)) return { kind: "content", topic: aliases[command] };
  if (owns(fileTopics, command) || command === "README.md" || command === "resume.pdf") return readFile(command, current);
  if (command.includes("/")) {
    const directory = asDirectory(command, current);
    if (directory) return { kind: "content", topic: directoryTopic(directory) };
    return readFile(command, current);
  }
  return text(`Command not found: ${rawCommand}. Type help for available commands.`);
}

/** Full input candidates. An empty result lets Tab keep its normal focus behavior. */
export function completeTerminalInput(input: string, currentDirectory: string = "~"): string[] {
  if (/[\r\n\x00-\x1f]/.test(input) || input.length > 256) return [];
  const normalized = normalizeTerminalInput(input);
  if (/[;|&<>`\\\r\n\x00-\x1f]/.test(normalized)) return [];
  const commandLine = normalized && /\s$/.test(input) ? `${normalized} ` : normalized;
  const current = cleanDirectory(currentDirectory);
  const match = commandLine.match(/^(\S+)(?:\s+(.*))?$/);
  if (!match) return [];
  const command = match[1];
  if (match[2] === undefined) {
    const commands = TERMINAL_COMMANDS.filter(value => value.startsWith(command));
    if (commands.length) return commands;
    const slash = command.lastIndexOf("/");
    const prefix = slash >= 0 ? command.slice(0, slash + 1) : "";
    const partial = command.slice(slash + 1);
    const parent = prefix ? asDirectory(prefix, current) : current;
    return parent ? completionFilesIn(parent).filter(file => file.startsWith(partial)).map(file => `${prefix}${file}`) : [];
  }
  const argument = match[2];
  if (/\s/.test(argument)) return [];
  if (command === "open") return [...openTargets].filter(target => target.startsWith(argument)).map(target => `open ${target}`);
  if (!["cd", "cat", "ls"].includes(command)) return [];
  const slash = argument.lastIndexOf("/");
  const prefix = slash >= 0 ? argument.slice(0, slash + 1) : "";
  const partial = argument.slice(slash + 1);
  const parent = prefix ? asDirectory(prefix, current) : current;
  if (!parent) return [];
  const entries = command === "cat" ? completionFilesIn(parent) : parent === "~" ? VISIBLE_TERMINAL_SECTIONS.map(section => `${section}/`) : [];
  const results = entries.filter(entry => entry.startsWith(partial)).map(entry => `${command} ${prefix}${entry}`);
  if (command === "cd" && !prefix) {
    for (const shortcut of ["~", "..", "~/", "-"]) if (shortcut.startsWith(partial)) results.push(`cd ${shortcut}`);
  }
  return [...new Set(results)];
}
