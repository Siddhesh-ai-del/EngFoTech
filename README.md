# EngFoTech

**Engineers forward with technology** — an AI career mentor for engineering students.

[![CI](https://github.com/armans7116/EngFoTech/actions/workflows/ci.yml/badge.svg)](https://github.com/armans7116/EngFoTech/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./license)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org)
[![tests](https://img.shields.io/badge/tests-29%20passing-brightgreen.svg)](./tests)

Tell it what you study, where you study, what you've built, and what you can afford —
it returns a month-by-month career plan: the jobs you can actually get, the skills you're
missing, how long each gap takes to close, and exactly what to do this month.

**No account, no login.** Your profile and roadmap are saved in your own browser, so the
app works identically on Vercel, Netlify, or locally.

Live site: [eng-fo-tech.vercel.app](https://eng-fo-tech.vercel.app)

---

## Table of contents

- [What you get](#what-you-get)
- [How it works](#how-it-works)
- [Where your data lives](#where-your-data-lives)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [API](#api)
- [Testing & CI](#testing--ci)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

## What you get

**1. Guided onboarding** — university, college, branch, year, CGPA, college tier,
languages, tools, certifications, projects, internships, career interests, and real-world
constraints (financial pressure, need a job immediately, open to relocating, higher-studies
budget).

**2. One analysis, many views.** Gemini turns that profile into a single typed
`AnalysisResult` (`src/types.ts`) which drives every screen:

| Output | What it tells you |
| --- | --- |
| `targetJobs` | Roles you can target, with companies, average salary, and *why* you fit |
| `sectorFit` + `jobProbability` | Which sector fits best, with a probability and an "Apply now / in 3 months / in 1 year" verdict |
| `skillGap` | Missing skills ranked by priority, difficulty (1–10), and time to close |
| `roadmap` | Month-by-month milestones with tasks, resources (free/paid), projects, pro tips |
| `recommendedSkills` | Skills to learn next, with difficulty rationale and resources |
| `strategy` | Resume tips, ATS keywords, LinkedIn tips, job platforms, cold-email template |
| `marketInsights` | Trending skills, demand level, salary range, growth % |
| `strategicMetrics` | Radar scores across skills, interests, academia, market demand, strategy |

**3. Tools built on that analysis:**

- **Dashboard** (`/`) — radar chart, market signals, next best actions, plus the
  skill-gap analyzer, system-design prep path, career opportunities, and mentor chat
- **Roadmap** (`/roadmap`) — the full month-by-month plan
- **Resume Analyzer** (`/resume`) — paste a resume, get a gap read against your target role
- **Mock Interview** (`/interview`) — practice questions from your own profile, with feedback

## How it works

```
browser                          express (server.ts)              gemini
───────                          ───────────────────              ──────
OnboardingForm ── POST /api/profile ──▶ sqlite (engfotech.db)
             ──▶ generateCareerAnalysis() ────────────────────────▶ Gemini
             ◀────────── AnalysisResult (JSON) ◀─────────────────
             ── POST /api/roadmap ────────▶ sqlite
Dashboard / Roadmap / Resume / Interview render from that AnalysisResult
```

- **Frontend:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 7 ·
  Recharts · Motion
- **Backend:** Express (`server.ts`) · SQLite (`better-sqlite3`) · optional Google OAuth
- **AI:** [`@google/genai`](https://www.npmjs.com/package/@google/genai) — one call per
  analysis, retry with backoff on 429/quota
- **Quality:** ESLint 10 · Prettier · Vitest + Testing Library · GitHub Actions

## Where your data lives

There is no account system. Everything the app knows about you lives in your browser's
`localStorage` under versioned keys:

| Key | Contents |
| --- | --- |
| `engfotech.profile.v1` | Your onboarding profile |
| `engfotech.analysis.v1` | The generated analysis — roadmap, skill gaps, target jobs, strategy |

- Saved locally: survives reloads and browser restarts, **per device and per browser** —
  it is not synced across devices, and clearing site data wipes it.
- **Start over** (↺ in the header) clears both keys deliberately, behind a confirmation.
- Corrupt or outdated entries are detected on boot and dropped instead of crashing the app.
- The generated analysis is only persisted once generation succeeds, so a failed Gemini
  call never leaves you half-way through onboarding.
- The Express API in `server.ts` (auth, profile, roadmap) is **retained but no longer
  called by the UI** — it stays tested and ready for a future server-backed mode.

## Quick start

**Prerequisites:** Node.js **22 or newer** (verified on 22, 24, and 26).

```bash
git clone https://github.com/armans7116/EngFoTech.git
cd EngFoTech
npm install
cp .env.example .env.local
```

Add your Gemini key to `.env.local` — grab one at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your-key-here
```

```bash
npm run dev
```

Open **http://localhost:3000** — you land straight in onboarding. No account to create.

> **`npm install` says some scripts were blocked?** npm 12+ runs install scripts only
> after approval (tracked in `allowScripts` in `package.json`). Review with
> `npm install-scripts ls` and approve with `npm install-scripts approve <pkg>`.
> `better-sqlite3` ships prebuilt binaries, so **no C++ toolchain is required**.

**Troubleshooting**

| Symptom | Fix |
| --- | --- |
| `Could not locate the bindings file` | You're on `better-sqlite3` v12 — upgrade to `^13.0.3` (prebuilt binaries) |
| Roadmap generation fails with 429 | Gemini rate limit/quota — wait a minute, or use a different key |
| Want a clean slate | Stop the server, delete `engfotech.db`, restart |
| Google login button does nothing | `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`APP_URL` are unset — email+password still works |

## Environment variables

Copy `.env.example` to `.env.local`. The server reads it with `dotenv`, the bundler with
Vite's `loadEnv`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | ✅ | Powers every AI feature |
| `GOOGLE_CLIENT_ID` | ⬜ | Enables "Sign in with Google" |
| `GOOGLE_CLIENT_SECRET` | ⬜ | Enables "Sign in with Google" |
| `APP_URL` | ⬜ | OAuth redirect base, e.g. `http://localhost:3000` |
| `PORT` | ⬜ | Server port (default `3000`) |
| `DATABASE_PATH` | ⬜ | SQLite location (default `./engfotech.db`; tests use `:memory:`) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR (Express + Vite middleware) |
| `npm run build` | Production bundle → `dist/` |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint — fails on errors |
| `npm run lint:fix` | ESLint with autofix (also strips dead imports) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage report → `coverage/` |
| `npm run format` / `npm run format:check` | Prettier write / check |

## Project structure

```
server.ts                        Express API (auth, profile, roadmap) + Vite middleware
src/
  App.tsx                        Onboarding → analysis gate, routes, localStorage restore
  components/
    OnboardingForm.tsx           4-step profile wizard
    Dashboard.tsx                Hub: radar, market signals, skill gap, opportunities, mentor chat
    RoadmapView.tsx              Month-by-month plan
    ResumeAnalyzer.tsx           Resume gap analysis
    MockInterview.tsx            AI interview practice
    MentorChat.tsx               Follow-up questions about your plan
    SkillGapAnalyzer.tsx         Missing-skill priorities
    SystemDesignPath.tsx         System-design prep track
    MarketInsights.tsx           Trending skills / demand / salary
    CareerOpportunities.tsx      Roles you can target
    PageNavigation.tsx           Shared in-app nav
  services/geminiService.ts      All Gemini calls + retry/backoff (client created lazily)
  services/storage.ts            Versioned localStorage persistence + shape validation
  constants.ts, types.ts         Domain types (`AnalysisResult` lives here)
  index.css                      Tailwind entry
tests/
  api.test.ts                    Supertest: register/login validation, profile & roadmap
  onboarding.test.tsx            Full 4-step wizard walkthrough
  storage.test.ts                Persistence round-trip, corrupt-data recovery, clear
  app.test.tsx                   No-login entry, restore, start-over flow
.github/workflows/ci.yml         lint → typecheck → test → build on Node 22 & 24
```

## API

> ℹ️ **The UI does not call these endpoints anymore** — see
> [Where your data lives](#where-your-data-lives). They remain available (and tested) for
> a future server-backed mode, and are still served by `npm run dev` / `npm start`.

Base URL: same origin as the app. Request/response bodies are JSON.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account (email ≥ valid, password ≥ 8 chars) |
| `POST` | `/api/auth/login` | Sign in, returns the user object |
| `GET` | `/api/auth/google/url` | Start Google OAuth |
| `GET` | `/api/auth/google/callback` | OAuth callback |
| `POST` | `/api/profile` | Save the onboarding profile |
| `GET` | `/api/profile/:userId` | Read a profile (skills/interests parsed back from JSON columns) |
| `POST` | `/api/roadmap` | Persist the generated analysis |
| `GET` | `/api/roadmap/:userId` | Latest saved analysis, or `null` |

> ⚠️ These endpoints are **not yet session-authenticated** — do not expose them publicly
> before the hardening work in [Known limitations](#known-limitations) lands.

## Testing & CI

```bash
npm test              # 29 tests, ~3s
npm run test:coverage
```

- **`tests/api.test.ts`** (13) — registration validation (400 vs 500 paths, duplicate
  email, short password), login success/failure, profile save + JSON round-trip,
  roadmap save/load, missing-user rejection
- **`tests/onboarding.test.tsx`** (5) — renders step 1, walks all four steps, asserts the
  submitted payload, and checks the submitting/disabled state
- **`tests/app.test.tsx`** (5) — first-time visitors get onboarding (no login UI),
  returning visitors are restored, start-over confirms then wipes storage
- **`tests/storage.test.ts`** (6) — persistence round-trip, corrupt/wrong-shape recovery,
  clear

Every push and pull request runs **lint → typecheck → test → build** on Node 22 and 24
(`.github/workflows/ci.yml`).

## Deployment

| Target | Status |
| --- | --- |
| **Vercel / Netlify (static)** | ✅ fully functional — the UI makes no API calls; Gemini is called directly from the browser |
| **Local dev** (`npm run dev`) | ✅ Vite HMR via `server.ts` (API available but unused by the UI) |
| **Self-hosted Node** (`npm run build && npm start`) | ✅ Express serves `dist/` |

Static hosting is the primary target now. If a server-backed mode (accounts, cross-device
sync) is added later, the API would move to serverless functions (`api/*.ts`) with a hosted
database — until then, no backend deployment is required at all.

## Known limitations

Track of things worth fixing, roughly by impact:

1. **`GEMINI_API_KEY` is bundled into the client JS** (`vite.config.ts` `define`) — treat
   the deployed key as public, rotate it if it leaks, and move Gemini calls behind a
   server endpoint.
2. **Data is per-browser** — profiles and roadmaps live in `localStorage`, so they don't
   follow a user across devices, and clearing site data loses them. Cross-device sync
   would need the (currently dormant) backend.
3. **The retained API must not be exposed publicly as-is** — passwords are stored in
   plaintext, and `/api/profile/:userId` + `/api/roadmap/:userId` trust a client-supplied
   `userId` with no session. Fine while the UI doesn't call it; hash + authenticate before
   reviving it.
4. **OAuth popup messaging is unchecked** (dormant) — `postMessage(..., '*')` server-side
   and no `event.origin` check client-side.
5. **Dependency audit** — `npm audit --omit=dev` reports known vulnerabilities; run
   `npm audit fix`.
6. **Single 1 MB JS chunk** — `React.lazy` the routes; Recharts (~400 KB) only paints on
   the dashboard.
7. **Prettier is configured but not gated in CI** — a repo-wide format pass deserves its
   own PR.

See [open issues](https://github.com/armans7116/EngFoTech/issues) for the backlog;
the tooling, tests, and CI arrived in [PR #1](https://github.com/armans7116/EngFoTech/pull/1).

## Contributing

1. Fork and branch: `git checkout -b feat/my-change`
2. Make the change, then make sure all four gates pass:

   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```

3. Commit using [conventional commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `perf:`)
4. Open a PR — CI re-runs everything on Node 22 and 24

## License

Apache-2.0 — see [`license`](./license).
