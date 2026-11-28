# AGENTS.md - central instructions for every coding agent

Read this file and the documents it points to before editing any code in this repository.

## Project context
Three-member hackathon team building **PS-02: The Ripple Effect** (see `.plans/`). Product direction and core stack are settled; scaffolding and implementation follow `ARCHITECTURE.md`, `API_CONTRACT.md`, `DATABASE_SCHEMA.md`, `UI_GUIDELINES.md`, and `TASKS.md`.

## Team structure and file ownership
Individual member names are `TODO - TEAM DECISION REQUIRED`. Ownership follows the 3-person layer split:
- **Role A (Backend API, Auth & Ripple Engine):** Express routes/controllers, `HttpOnly` JWT auth, MyGate onboarding logic, deterministic R1–R5 ripple engine, R4 server-side redaction, `API_CONTRACT.md` implementation.
- **Role B (Frontend UI, Workspace & Graph):** `client/` Vite + React + TS app shell, Tailwind tokens/primitives, `UI_GUIDELINES.md`, My Team / My Work / My Decisions views, React Flow ripple graph, decision authoring UI.
- **Role C (Database, `.xlsx` Validation, QA & Deploy):** `DATABASE_SCHEMA.md`, PostgreSQL + Prisma schema/migrations/seed, Zod `.xlsx` importer, Vitest + Supertest test strategy, security checks, single-origin cloud deployment.
- **Shared (`shared/`):** Shared TypeScript contracts and Zod schemas coordinated across Roles A, B, and C.
Never modify another member's module or a shared contract file without coordinating in the PR and with the owner.

## Technology stack
Settled on 2026-11-28 and recorded in `.plans/technical-decisions.md` and `ARCHITECTURE.md`:
- Frontend: React + Vite + TypeScript, Tailwind CSS, React Flow (`@xyflow/react`).
- Backend: Node.js + Express + TypeScript, Zod runtime validation.
- Database: PostgreSQL + Prisma ORM.
- Auth: Real email/password (`bcrypt` + JWT in `HttpOnly` cookie) + seeded synthetic demo accounts.
- AI / External APIs: None in MVP (deterministic R1–R5 engine).
- Testing: Vitest + Supertest.
Do not change selected technologies without team agreement.

## Architecture principles
- Modules communicate only through the contracts in `shared/`, `API_CONTRACT.md`, and `DATABASE_SCHEMA.md`.
- Shared interfaces change only with team agreement and contract doc updates before dependent members continue.
- Keep the application runnable after every merge to `develop`.

## Coding conventions
- Follow `.agents/rules/coding-standards.md`.
- Small, reviewable commits with conventional-commit style messages (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- No unapproved dependencies. Propose additions before installing.

## Skill usage
- Project skills live in `.agents/skills/`; see `SKILL_CATALOG.md` and `SKILL_USAGE.md`.
- Use the `interview` skill during planning, `ste` for unclear writing, `better-ui`/`animate` for UI polish, and the installed engineering skills for their domains.
- Third-party skills are read-only: do not edit their contents or remove copyright notices.

## API contract requirements
- Every endpoint follows `API_CONTRACT.md`: naming, request/response schemas, error format, auth. Do not invent endpoints outside the contract; add them to the contract first.
- Treat the **R4 redaction guarantee** (`Confidential` decisions redacted for `Internal` clearance with deterministic safe action context) as a server-side requirement that must be verified by automated tests—never rely on client-side hiding or assume it is proven without passing tests.

## Database requirements
Schema, tables, constraints and indexes follow `DATABASE_SCHEMA.md`. All schema changes go through forward-only Prisma migrations owned by Role C.

## UI guidelines
All interface work follows `UI_GUIDELINES.md`: tokens, spacing, components, accessibility, motion.

## Security & dataset isolation rules
- Never commit `.env`, API keys, tokens, passwords or any credentials. See `.agents/rules/security.md`.
- Keep participant workbook data (`PS02_Ripple_Effect.xlsx` and any converted files) out of Git, client imports, `public/` assets, and deployment artifacts—only accept datasets at runtime via Admin upload or local gitignored dev workflows.
- Validate all input on the server.

## Testing expectations
- Relevant tests pass before every PR. See `.agents/rules/testing.md`.
- Role C owns the test strategy; every feature ships with the tests its row in `TASKS.md` lists, including explicit Vitest + Supertest coverage for R1–R5 and R4 redaction.

## Git workflow
Branches and PR rules: `CONTRIBUTING.md`. No direct commits to `main`.

## Integration policy
Integration is continuous (Phase 9 of `HACKATHON_WORKFLOW.md`). Contract changes are announced before dependents continue. Broken merges are rolled back, not patched forward under time pressure.
