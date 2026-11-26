# jhadhiraj.com

Personal portfolio of **Dhiraj Jha** — a systems and backend engineer studying
Computer Science and Mathematics at Fisk University.

🔗 **Live:** [jhadhiraj.com](https://jhadhiraj.com)

A single-screen terminal built with the Next.js App Router. Visitors type
commands to read about me, experience, projects, education, travel, contact
details, and Spotify Beats. Responses appear in terminal scrollback; there are
no sections below the first screen.

## Tech stack

| Area       | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| Language   | TypeScript                               |
| Styling    | Tailwind CSS                             |
| Interface  | Virtual terminal with command history and completion |
| Console font | Locally hosted VGA 8×16 webfont |
| Hosting    | Vercel                                   |

## Project structure

```
app/                 Next.js App Router entry
  layout.tsx         Root layout — fonts, metadata, <html> shell
  page.tsx           Single terminal screen and background
  globals.css        Global styles and Tailwind layers
components/
  terminal/          Inline command output, including live GitHub and Beats
  sections/Hero.tsx  Terminal display, command input, and history
  ui/PhotoBackdrop  Responsive pixel-art wallpaper
lib/
  data.ts            Single source of truth for site content
public/assets/       Images, logos, and resume PDF
instrumentation.ts   Server-start hook (SSR localStorage shim — see file comment)
```

Profile, experience, projects, and skills live in [`lib/data.ts`](lib/data.ts).
Command parsing lives in `lib/portfolio-terminal.ts`, with inline output in
`components/terminal/TerminalOutput.tsx`. Previous section components are retained
in the repository but are not mounted by the current single-screen interface.

Recent public GitHub repositories also appear automatically, without a rebuild.
The feed refreshes hourly and retains the selected project case studies if GitHub
is unavailable. See [GitHub setup](docs/github-projects.md) for the optional
server-only token and refresh behavior.

The design uses a dark teal terminal palette and pixel-art version of the original
city photograph. Assets and the image-generation prompt are documented in
[terminal background](docs/terminal-background.md).

The interface uses a locally hosted classic VGA 8×16 console font and a working
portfolio command prompt (`help`, `projects`, `cd beats`, `clear`). See the
[command guide](docs/terminal.md) and [font attribution](docs/console-font.md).
The [Spotify Beats setup](docs/spotify-beats.md) connects the owner's recent
listening history after one local authorization; no visitor sign-in is needed.

## Getting started

Prerequisites: **Node.js 22.18+** and npm (the tests import TypeScript directly).

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint (next/core-web-vitals)    |
| `npm run typecheck` | Check TypeScript                |
| `npm test`      | Run terminal, GitHub, and Spotify regressions |

## Updating the resume

The resume is served here as a static PDF:

- Source (read only): <https://www.overleaf.com/read/bkthdkdzhftp#d798f5>
- Served file: `public/assets/resume/resume_jhadhiraj147.pdf`

The current served PDF is an exact copy of the November 18, 2026 version from
the owner's Downloads folder. It confirms the current Vanderbilt role as
Software Developer (part-time), Aug 2026–Present.

To refresh it, replace the served PDF with the latest exported resume, keeping
the same filename so the `resume` command keeps working.

Overleaf read links expose no public PDF endpoint, so this step is manual.
Automating it would need Overleaf's Git bridge (a premium feature), after which
a scheduled job could clone the project, compile it, and commit the PDF.

## Security and release checks

Run `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`,
and `npm audit` before a release. The November 2026 audit updated Next.js to
15.5.29 and React to 19.0.9, corrected the React 19 map dependency, and removed
the legacy peer-dependency workaround. The PostCSS override keeps Next.js on
the patched version used by this project; the brace-expansion override patches
the older ESLint dependency without changing its major version.

Keep API credentials in the hosting environment or ignored `.env.local`,
without a `NEXT_PUBLIC_` prefix. The public routes expose only curated display
data. Request deduplication and failure cooldowns protect the upstream APIs
within each server process; hosting-level limits are needed for protection
across many instances. Rotate any credential exposed in a screenshot or chat.

The browser policy blocks embedding, plugin objects, unapproved connections,
and external scripts. Inline hydration scripts and styles remain allowed for
Next.js's static rendering; the development-only eval and WebSocket allowances
are absent from production. This is a baseline CSP, not a nonce-based policy.
No terminal command executes a program or reads the host filesystem.

Next.js 15's security support ends January 31, 2027; plan a major-version
upgrade before then. See the [support policy](https://nextjs.org/support-policy)
and [November security release](https://nextjs.org/blog/november-2026-security-release).

## License

The **source code** in this repository is released under the
[MIT License](LICENSE).

The **personal content** — written copy, photographs, logos, and the resume PDF
under `public/assets/` — is © Dhiraj Jha and is **not** licensed for reuse.
You're welcome to learn from the code; please don't republish the content as
your own.

The third-party console font in `public/fonts/` is by VileR and licensed under
CC BY-SA 4.0. Its attribution and full license are included in that directory.
