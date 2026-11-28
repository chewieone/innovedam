# Architecture

Status: Stack and M1 scaffold checkpoint complete on 2026-11-28. Planning docs updated for HR assigned-team tracking, role-bound successor continuity, and separated Team Lead execution progress; M2 implementation is paused pending planning review. Remaining open details are marked `TODO - TEAM DECISION REQUIRED`.

## System overview
Single-origin full-stack TypeScript web application (`client/` + `server/` + `shared/`) backed by PostgreSQL:
- **Client (`client/`):** Vite + React + TypeScript SPA styled with Tailwind CSS, using React Flow (`@xyflow/react`) for interactive dependency and ripple graphs.
- **API & Engine (`server/`):** Node.js + Express + TypeScript REST API enforcing `HttpOnly` JWT authentication, MyGate-style manager-approval onboarding, Zod-validated `.xlsx` workbook ingestion, full-graph deterministic R1-R5 ripple traversal, assignment-based HR/Team Lead projections, and server-side R4 confidentiality redaction.
- **Database:** PostgreSQL accessed via Prisma ORM with forward-only migrations.
- **Shared contracts (`shared/`):** Shared TypeScript interfaces and Zod validation schemas consumed by both `client/` and `server/`.
- **No AI / External APIs in MVP:** R4 safe action context is generated deterministically on the server from templates.

```text
[React + Vite + TS + Tailwind + React Flow]
          |  HTTPS / JSON + HttpOnly JWT Cookie (/api/v1/*)
          v
[Node.js + Express + TS API Server]
  |-- Auth, MyGate Onboarding & Role-Seat / HR-Assignment Guards
  |-- Zod Workbook Importer (.xlsx -> validated PS-02 Company dataset)
  |-- Full-Graph Deterministic Ripple Engine (R1-R5 traversal, never truncated)
  |-- Assignment Projection & R4 Server Redaction Layer (clearance + role scope)
  |-- Team Execution Progress Service (separate from Decision approval)
          |  Prisma ORM
          v
[PostgreSQL]
```

## Frontend architecture
- Framework: React + TypeScript with Vite (`client/`).
- Styling: Tailwind CSS with CSS custom property tokens (`client/src/styles/tokens.css`).
- Interactive graph: React Flow (`@xyflow/react`) rendering root work items, transitive prerequisite-to-dependent edges, `Closed` pass-through nodes, `Open` affected nodes, execution progress badges, and R4-redacted badges.
- State management: React Context for authenticated session (`AuthProvider` backed by `/api/v1/auth/me`) + hook-based server-state fetching (`client/src/hooks/`).
- Folder structure:
  - `client/src/components/ui/` — shared primitives
  - `client/src/components/graph/` — React Flow ripple graph and node/edge renderers
  - `client/src/features/` — `auth`, `onboarding`, `workspace`, `hrTracking`, `decisions`, `import`
  - `client/src/lib/` — typed API client (`fetch` with `credentials: 'include'`)
- Shared UI primitives live in: `client/src/components/ui/` (owned by Role B; built before feature views).

## Backend architecture
- Framework: Node.js + Express + TypeScript (`server/`).
- Layering:
  - `routes/` — Express routers mapping `/api/v1/*` endpoints and middleware (`requireAuth`, `requireApprovedMember`, `requireManagerOrAdmin`, `requireHrSeat`, `requireAdmin`)
  - `controllers/` — request parsing (via Zod) and HTTP response mapping
  - `services/` — `authService`, `onboardingService`, `roleAssignmentService`, `workbookImportService`, `rippleEngineService`, `redactionService`, `executionProgressService`, `decisionService`
  - `repositories/` / Prisma client — PostgreSQL data access
- Error handling convention: Central Express error middleware formatting all errors to the single `API_CONTRACT.md` envelope (`{ error: { code, message, details } }`).
- Request & workbook validation library: Zod (shared schemas for API payloads and 5-sheet `.xlsx` row/enum/FK validation).
- **PS-02 Rule Preservation & Assignment Scoping Invariant:**
  - `rippleEngineService` ALWAYS traverses the full company `Work_Items` + `Dependencies` graph (R1-R5) first—never pre-filtering nodes or edges by HR team assignment or user team, so transitive paths through unassigned, `Closed`, or `Confidential` nodes are never cut off.
  - Assignment-based visibility (`HrTeamAssignment` for HR; team ownership for Team Leads) and R4 clearance redaction (`Internal` vs `Confidential`) are applied **after** full traversal when building API response projections.
  - Decision approval (`Decisions.status = Approved`) triggers R1-R4 ripples and initializes follow-through; it is strictly decoupled from Team Lead execution progress (`WorkExecutionProgress`).
  - Role-bound HR continuity (`RoleSeat` + `HrTeamAssignment`) transfers assigned-team tracking and follow-through history to a successor HR without mutating `Decisions.decider_id` (original decision author) and without bypassing the successor's `Employee.clearance` under R4.
- Workbook confidentiality & security boundaries:
  - `.xlsx` files uploaded by an Admin are parsed in memory or temp upload buffer and validated against the 5-sheet schema (`Employees`, `Work_Items`, `Dependencies`, `Decisions`, `Rules`). Participant data (`PS02_Ripple_Effect.xlsx` and any conversions) must stay strictly out of Git, `client/` imports, `client/public/` assets, and deployment artifacts (`dist/`, `server/dist/`).
  - Rules R1-R5 and `Employee.clearance` (`Internal` vs `Confidential`) are the strict source of truth for visibility; team/hierarchy navigation never bypasses R4 redaction, and R4 redaction is treated as a requirement verified by automated server/API tests.

## AI service architecture
- Required? No (decided 2026-11-28: deterministic R1-R5 engine only in MVP).
- Provider/model: None in MVP.
- Prompt and evaluation approach: Not applicable. `redactionService` produces deterministic safe action context strings for `Internal` users impacted by `Confidential` decisions.
- Non-AI ownership: Role C owns `.xlsx` schema validation, PostgreSQL/Prisma schema, testing, and deployment; Role A owns the deterministic R1-R5 ripple engine, role/assignment scoping, and API.

## Database architecture
- Database: PostgreSQL.
- Access pattern: Prisma ORM (`server/prisma/schema.prisma`) with transactions for workbook imports, approval transitions, HR seat transfers, execution progress updates, and ripple notification updates.
- Migration tool: Prisma Migrate (`prisma migrate dev` locally, `prisma migrate deploy` in production; forward-only).

## External integrations
- None in MVP (`TODO - TEAM DECISION REQUIRED` if any external notification or storage integration is added post-MVP).

## Module communication
- Frontend <-> backend: HTTP/JSON over `/api/v1/*` per `API_CONTRACT.md` with `HttpOnly` cookie session (`credentials: 'include'`).
- Backend <-> database: Prisma Client per `DATABASE_SCHEMA.md`.
- Shared contracts: `shared/` exports TypeScript types and Zod schemas for API DTOs, workbook row validation, R1-R5 ripple outputs, HR team assignments, and execution progress.

## Deployment architecture
- Target: Single-origin cloud deploy — Render or Railway hosting the Node/Express server (serving both `/api/v1/*` and the compiled Vite `client/dist/` static bundle) connected to managed PostgreSQL (Neon or Supabase). Exact provider selection: `TODO - TEAM DECISION REQUIRED` at deploy time.
- Why single-origin: Eliminates cross-origin `HttpOnly` cookie and CORS complexity during the 24-hour sprint.
- Environments: Local development (Vite dev server proxying `/api` to Express on `localhost:3001` + local/Docker or Neon Postgres) and single-origin production.
