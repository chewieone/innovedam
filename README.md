# innovedam — PS-02: The Ripple Effect

Shared hackathon repository for our 3-member team building **PS-02 ("The Ripple Effect")**. Every member clones this repo, opens it in Google Antigravity, and works from the shared contracts before coding.

## Project overview
- **Product objective:** A company hierarchy and decision-impact workspace where an Admin sets up an organization and imports schema-valid PS-02 `.xlsx` datasets, new members onboard via MyGate-style manager approval, and every member sees their team, relevant work, and cascading decision ripples governed strictly by workbook Rules R1-R5 and `Internal`/`Confidential` clearance (see [`.plans/product-spec.md`](.plans/product-spec.md)).
- **Problem being solved:** Business decisions cascade unpredictably across transitive work-item dependencies and teams, while static spreadsheets cannot separate `Draft` vs `Approved` decisions (R1), traverse through `Closed` deliverables without mis-notifying closed-item owners (R3), redact `Confidential` decisions with safe action context for `Internal` users (R4), or withdraw/review scope on `Reverse` decisions (R5) (see [`.plans/problem-discovery.md`](.plans/problem-discovery.md)).
- **Official PS-02 problem statement:** `TODO - TEAM DECISION REQUIRED` (full official narrative text was not in the attached workbook or repo files; workbook `Purpose`: *"Identify direct and indirect affected work and recipients; distinguish draft and approved decisions."*).
- **Target users:** Company Admins, Team Managers / Higher-ups, and `Internal` / `Confidential` employees across programs; plus judges testing alternate datasets matching the 5-sheet PS-02 schema.

## Tech stack
Settled on 2026-11-28 (replaces earlier browser-only proposal; recorded in [`.plans/technical-decisions.md`](.plans/technical-decisions.md) and [`ARCHITECTURE.md`](ARCHITECTURE.md)).

| Layer | Choice | Status |
| --- | --- | --- |
| Frontend framework | React + Vite + TypeScript | decided |
| Styling & Graph UI | Tailwind CSS + React Flow (`@xyflow/react`) | decided |
| Backend framework | Node.js + Express + TypeScript | decided |
| Validation & Shared Types | Zod + `shared/` TypeScript contracts | decided |
| Database & ORM | PostgreSQL + Prisma ORM | decided |
| Authentication | `bcrypt` + JWT in `HttpOnly` cookie + seeded demo accounts | decided |
| AI model/provider | None in MVP (deterministic R1-R5 engine) | decided |
| Hosting | Single-origin cloud deploy (Render or Railway + Neon or Supabase Postgres) | decided (exact provider pair open) |
| Testing | Vitest + Supertest | decided |

## Setup instructions
> **Dataset rule:** Keep `PS02_Ripple_Effect.xlsx` and any converted files strictly local. They are ignored in `.gitignore` and must never be committed, statically imported, or included in any build.

1. Clone this repository.
2. Open the folder in Antigravity.
3. Copy `.env.example` to `.env` and fill in local values (`DATABASE_URL`, `JWT_SECRET`, `SEED_DEMO_PASSWORD`). Never commit `.env`.
4. Ensure PostgreSQL is running locally (or configure a Neon/Supabase connection string in `.env`).
5. Install dependencies across workspace packages once scaffolded (Phase 7): `npm install` (exact workspace scripts added when scaffolding begins).
6. Run Prisma migrations and seed demo accounts (Phase 7): `npx prisma migrate dev` and `npx prisma db seed`.
7. Restore project skills if missing: `npx skills experimental_install` (restores from `skills-lock.json`). A CLI restore re-copies upstream files only, so afterwards run `git checkout -- .agents/skills` to bring back the license files and OWASP playbook files this repo tracks beside the skills. Warning: that checkout discards any uncommitted local edits inside `.agents/skills/`; commit or back up such edits first, and only run it with a clean working tree for that directory.

## Run instructions
Once the Phase 7 skeleton is scaffolded:
- Development: run the Express API server (`PORT=3001`) and Vite dev server (`http://localhost:5173`, proxying `/api` to `http://localhost:3001`).
- Tests: `npm test` (Vitest unit tests for R1-R5/Zod + Supertest API integration tests).
- Production single-origin build: build `client/` into static assets served by Express alongside `/api/v1/*`.

## Repository structure
| Path | Contents |
| --- | --- |
| `AGENTS.md` | Central instructions every coding agent reads first |
| `.agents/rules/` | Shared project rules loaded by Antigravity |
| `.agents/skills/` | Project-level third-party skills (installed via Skills CLI) |
| `.plans/` | Discovery, product spec, MVP scope, and technical decisions |
| `ARCHITECTURE.md` | System design and module boundaries |
| `API_CONTRACT.md` | `/api/v1` conventions, error shape, R4 guarantee, and endpoints |
| `DATABASE_SCHEMA.md` | PostgreSQL + Prisma schema, relationships, and indexes |
| `UI_GUIDELINES.md` | Tailwind tokens, navigation, accessibility, and R1-R5 UI states |
| `CONTRIBUTING.md` | Branching, commits, PRs, reviews |
| `TASKS.md` | Milestones, 3-person ownership, and P0-P2 task table |
| `HACKATHON_WORKFLOW.md` | End-to-end 12-phase team process |
| `SKILL_CATALOG.md` | Every installed skill, source, license, status |
| `SKILL_USAGE.md` | When and by whom each skill is used |
| `THIRD_PARTY_NOTICES.md` | Attribution for third-party skills |

## Team roles (3-person manual split)
Replaces the earlier withdrawn 6-member automated split. Individual member names: `TODO - TEAM DECISION REQUIRED`.

| Role | Focus | Owns |
| --- | --- | --- |
| Role A | Backend API, Auth & Ripple Engine | Express routes/controllers, `HttpOnly` JWT auth, MyGate onboarding logic, deterministic R1-R5 ripple engine, R4 server-side redaction |
| Role B | Frontend UI, Workspace & Graph | Vite + React + TS app shell, Tailwind tokens/primitives, My Team / My Work / My Decisions views, React Flow ripple graph, decision authoring UI |
| Role C | Database, `.xlsx` Validation, QA & Deploy | PostgreSQL + Prisma schema/migrations/seed, Zod `.xlsx` importer, Vitest + Supertest suite, single-origin cloud deployment |

Each task has one primary owner. Members help each other across boundaries, while shared contracts (`shared/`, `API_CONTRACT.md`, `DATABASE_SCHEMA.md`) are updated in sync before dependent code changes.

## Development workflow
See `HACKATHON_WORKFLOW.md` and `CONTRIBUTING.md`. Branches: `main` (stable), `develop` (integration), and per-feature/module branches merged to `develop` via PRs.
