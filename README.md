# EngFoTech

**Engineers forward with technology** — an AI-powered career guidance and mentorship
platform for engineering students, built with React + Gemini.

Live site: [eng-fo-tech.vercel.app](https://eng-fo-tech.vercel.app)

## Features

| Feature | What it does |
| --- | --- |
| **Career Dashboard** | Skills/interests/strategy radar, market signals, next best actions |
| **Career Roadmap** | Step-by-step path to target roles, generated from your profile |
| **Resume Analyzer** | Paste a resume, get gap analysis against your target role |
| **Mock Interview** | Voice-of-the-panel practice questions with AI feedback |
| **Mentor Chat** | Ask follow-up questions about your plan |
| **Skill Gap Analyzer** | Compare current skills against job-market demand |
| **System Design Path** | Structured system-design prep track |
| **Market Insights** | Role demand, salary bands, hiring trends |

Onboarding collects university, branch, year, CGPA, skills, interests, and constraints,
then calls Gemini to produce a personalized analysis that is persisted server-side.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, Recharts, Motion
- **Backend:** Express (`server.ts`), SQLite via `better-sqlite3`, Google OAuth
- **AI:** `@google/genai` (Gemini)
- **Quality:** ESLint 10 flat config, Prettier, Vitest + Testing Library, GitHub Actions

## Quick start

**Prerequisites:** Node.js **22 or newer** (Node 22/24/26 verified).

```bash
git clone https://github.com/armans7116/EngFoTech.git
cd EngFoTech
npm install
cp .env.example .env.local
```

Put your Gemini API key in `.env.local`:

```
GEMINI_API_KEY=your-key-here
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

> **`npm install` blocked some package scripts?** npm 12+ asks before running
> install scripts (`allowScripts` in `package.json`). Approve them once with
> `npm install-scripts ls` / `npm install-scripts approve <pkg>`.
> `better-sqlite3` ships prebuilt binaries, so no C++ toolchain is required.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR (Express + Vite middleware) |
| `npm run build` | Production bundle into `dist/` |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (fails on errors) |
| `npm run lint:fix` | ESLint with autofix (strips dead imports) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (API + component tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage report into `coverage/` |
| `npm run format` / `format:check` | Prettier write / check |

## Project structure

```
server.ts                 Express app: auth, profile, roadmap APIs + Vite middleware
src/
  App.tsx                 Auth gate, session restore, routing, onboarding flow
  components/             One file per screen (Dashboard, RoadmapView, ...)
  services/geminiService.ts   All Gemini calls (roadmap, resume, chat, interview)
  constants.ts, types.ts, index.css
tests/
  api.test.ts             Supertest coverage of the Express API
  onboarding.test.tsx     Onboarding wizard walkthrough
.github/workflows/ci.yml  Lint + typecheck + test + build on Node 22 & 24
```

## Tests & CI

`npm test` runs 18 tests: registration/login validation, profile and roadmap
round-trips, and a full 4-step onboarding walk-through. Every push and pull
request runs lint, typecheck, tests, and a production build on Node 22 and 24.

## Known limitations (work in progress)

- **The Gemini API key is currently bundled into the client JS** during build
  (see `vite.config.ts`). Treat the deployed key as public and rotate it if it
  leaks; the fix is to proxy Gemini calls through the server.
- **Passwords are stored in plaintext and data endpoints are not session-authenticated** —
  do not reuse an existing password on this site.
- **The deployed Vercel site serves the static build only**, so auth, profile,
  and roadmap APIs work locally (`npm run dev`) but not on Vercel until the
  backend is deployed as serverless functions with a hosted database.

See the repository's open issues for the full review backlog.

## License

Apache-2.0 — see [`license`](./license).
