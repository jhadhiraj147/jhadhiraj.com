# jhadhiraj.com

Personal portfolio of **Dhiraj Jha** — a systems and backend engineer studying
Computer Science and Mathematics at Fisk University.

🔗 **Live:** [jhadhiraj.com](https://jhadhiraj.com)

A single-page site built with the Next.js App Router: a hero, an about section,
skills, experience, projects, education, a few personal facts, an interactive
travel map, and contact links.

## Tech stack

| Area       | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| Language   | TypeScript                               |
| Styling    | Tailwind CSS                             |
| Animation  | Framer Motion                            |
| Data viz   | react-simple-maps (interactive world map) |
| Hosting    | Vercel                                   |

## Project structure

```
app/                 Next.js App Router entry
  layout.tsx         Root layout — fonts, metadata, <html> shell
  page.tsx           Page composition (section order)
  globals.css        Global styles and Tailwind layers
components/
  layout/            Navbar
  sections/          One file per page section (Hero, About, …, Footer)
  ui/                Reusable primitives (GlassCard, SectionHeading, …)
lib/
  data.ts            Single source of truth for site content
public/assets/       Images, logos, and resume PDF
instrumentation.ts   Server-start hook (SSR localStorage shim — see file comment)
```

All site content (bio, experience, projects, skills) lives in
[`lib/data.ts`](lib/data.ts), so copy changes never require touching component code.

## Getting started

Prerequisites: **Node.js 18+** and npm.

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

## Updating the resume

The resume is authored on Overleaf and served here as a static PDF:

- Source (read only): <https://www.overleaf.com/read/bkthdkdzhftp#d798f5>
- Served file: `public/assets/resume/resume_jhadhiraj147.pdf`

To refresh it: open the Overleaf project, **Download PDF**, and replace that
file, keeping the same filename so the Resume button keeps working.

Overleaf read links expose no public PDF endpoint, so this step is manual.
Automating it would need Overleaf's Git bridge (a premium feature), after which
a scheduled job could clone the project, compile it, and commit the PDF.

## License

The **source code** in this repository is released under the
[MIT License](LICENSE).

The **personal content** — written copy, photographs, logos, and the resume PDF
under `public/assets/` — is © Dhiraj Jha and is **not** licensed for reuse.
You're welcome to learn from the code; please don't republish the content as
your own.
