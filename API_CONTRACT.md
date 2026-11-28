# API Contract

Conventions and MVP endpoints updated on 2026-11-28 (adds explicit HR team assignments, role-seat successor continuity, and Team Lead execution progress while preserving PS-02 R1-R5 endpoints and M1 scaffold). Do not implement undocumented endpoints without updating this file first.

## Conventions
- Base path: `/api`. Version prefix: `/api/v1`.
- Resource naming: lowercase plural nouns, kebab-case for multi-word (`/api/v1/work-items`, `/api/v1/onboarding-requests`, `/api/v1/hr-assignments`).
- JSON request and response bodies (`Content-Type: application/json`), except `.xlsx` workbook upload (`multipart/form-data`).
- Timestamps: ISO 8601 UTC in JSON responses (with IST display formatting on client where helpful, matching workbook convention).

## Methods
| Method | Use | Success status |
| --- | --- | --- |
| GET | read, no side effects | 200 |
| POST | create / actions (login, import, approve, reverse, seat handoff) | 201 (create) or 200 (actions) |
| PATCH | partial update (e.g., team execution progress) | 200 |
| PUT | full replace | 200 |
| DELETE | remove | 204 |

## Request schemas
- Every request body, query param, and uploaded `.xlsx` workbook is validated at runtime on the server using **Zod** (unknown fields rejected via `.strict()` on JSON inputs).
- Pagination for large lists: `?page=&limit=`, response carries `{ items, page, limit, total }`.

## Response schemas
- Success: returns the resource DTO directly (or `{ items, ... }` for lists), no extra envelope wrapper.
- **R4 Redaction Requirement (must be verified by automated tests on all endpoints returning decisions, ripples, HR follow-through, or notifications):**
  - When `req.employee.clearance === 'Internal'` and a `Decision` has `visibility === 'Confidential'`, the server **must** strip `decisionText` (returning `isRedacted: true`, `decisionText: null`, and deterministic `safeActionContext`).
  - Team/hierarchy navigation and HR team assignments **never** override `Employee.clearance` or R1-R5. Treat this guarantee as a requirement to test continuously via Vitest + Supertest, never assumed proven by client-side UI hiding.
- **Authorization & Traversal Separation (OWASP API1/API3):**
  - `rippleEngine` always computes over the full company dependency graph so R2/R3 traversal is never truncated.
  - HR tracking endpoints enforce server-side checks against `hr_team_assignments` for the caller's active `RoleSeat` (returning `403 FORBIDDEN` if an unassigned team is requested directly). HR tracking is read-only on Team Lead execution progress; in **PS-02 Ripple Solver** (`/decisions/:decisionId/ripple`), HR sees the full causal chain into assigned teams with R4 redaction applied to the active viewer's `Employee.clearance`.
  - Execution progress `PATCH` endpoints enforce Team Lead (`Employee.role === 'Manager'` in `workItem.team`, or Company Admin override) — returning `403 FORBIDDEN` if a non-manager, HR-only tracker, or wrong-team user targets the item.

## Error format
Single agreed shape:
```json
{
  "error": {
    "code": "MACHINE_READABLE_CODE",
    "message": "Human-readable summary",
    "details": []
  }
}
```
Status codes: `400` validation (including invalid `.xlsx` schema), `401` unauthenticated, `403` forbidden (pending onboarding, non-manager approval, unassigned HR team, wrong-team progress update, clearance violation), `404` missing, `409` conflict, `500` unexpected.

## Authentication
- Mechanism: Real email/password auth (`bcrypt` hash) issuing signed JWT stored in an `HttpOnly`, `SameSite=Lax` cookie (`ripple_session`).
- Seeded synthetic demo accounts (`Internal`, `Confidential`, `HR`, `Team Lead`) authenticate through the exact same `/api/v1/auth/login` endpoint—no unauthenticated header spoofing.
- All endpoints default to authenticated unless marked `public`. Approved company membership is required for all `/companies/:companyId/*` workspace, work-item, decision, HR tracking, and graph endpoints (`Pending` users only access auth + onboarding status).

## API ownership
Role A owns API implementation, auth/RBAC guards, and the R1-R5 ripple engine; Role C owns `.xlsx` parsing/DB persistence; shared TypeScript + Zod contracts in `shared/` are updated together before dependent frontend/backend changes proceed.

## Endpoint registry
| Method | Path | Purpose | Owner | Status |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/health` | Health check (API + PostgreSQL connectivity) | Role A | scaffolded (M1) |
| POST | `/api/v1/auth/register` | Public: create `User` account (`email`, `password`, `fullName`) | Role A | scaffolded (M1) |
| POST | `/api/v1/auth/login` | Public: authenticate and set `HttpOnly` JWT cookie | Role A | scaffolded (M1) |
| POST | `/api/v1/auth/logout` | Clear session cookie | Role A | scaffolded (M1) |
| GET | `/api/v1/auth/me` | Return current `User`, company memberships, `Employee` link, active `RoleSeat`, assigned HR teams, clearance, and onboarding status | Role A | scaffolded (M1; extend M2) |
| GET | `/api/v1/companies` | List available companies or user's companies | Role A | planned (P0) |
| POST | `/api/v1/companies` | Create a company and provision the creator as Admin + top-level `Employee` | Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/import-workbook` | Admin: upload `.xlsx` (`multipart/form-data`), validate 5 PS-02 sheets via Zod, load dataset & materialize R1-R5 impacts | Role C / Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/onboarding-requests` | Submit MyGate join request (team/role/target manager or unlinked `employeeCode`) | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/onboarding-requests` | Manager/Admin: list `Pending` (and recent) onboarding requests in scope | Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/onboarding-requests/:requestId/review` | Manager/Admin: approve (links/creates `Employee` + clearance) or reject pending request | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/role-seats` | Admin: list HR/Team Lead seats and explicit team assignments | Role A | planned (P0, M2) |
| PUT | `/api/v1/companies/:companyId/role-seats/:seatId/teams` | Admin: set explicit `teams[]` assigned to an HR role seat | Role A | planned (P0, M2) |
| POST | `/api/v1/companies/:companyId/role-seats/:seatId/handoff` | Admin: assign successor `userId`/`employeeId` to an HR role seat (transfers role-bound history; preserves `decider_id` and viewer R4 clearance) | Role A | planned (P0, M2) |
| GET | `/api/v1/companies/:companyId/my-workspace` | Approved member: returns My Team hierarchy, My Work + execution progress, HR assigned-teams tracking (if HR seat), and R4-redacted My Decisions / Impact Inbox | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/hr/assigned-teams-tracking` | HR seat: returns decisions and Team Lead execution progress scoped strictly to explicitly assigned teams (R4-redacted; never hierarchy-inherited) | Role A | planned (P0, M2) |
| GET | `/api/v1/companies/:companyId/employees` | List org hierarchy (managers, teams, roles, clearance metadata) | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/work-items` | List work items, dependencies, and current execution progress | Role A | planned (P0) |
| PATCH | `/api/v1/companies/:companyId/work-items/:workId/progress` | Team Lead (`role === 'Manager'` for `workItem.team`, or Admin): update execution progress (`progressState`, `progressPercent`, `note`) independently of `WorkItem.status` and `Decision.status` (HR is read-only) | Role A | planned (P0, M2) |
| GET | `/api/v1/companies/:companyId/decisions` | List decisions (preserving original `deciderId`, distinguishing `Draft` vs `Approved` vs `Reverse`, R4-redacted for `Internal`) | Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/decisions` | Create a new `Draft` decision (R1: zero notifications triggered) | Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/decisions/:decisionId/approve` | Approve a `Draft` decision -> executes R1-R4 ripple traversal and creates notifications | Role A | planned (P0) |
| POST | `/api/v1/companies/:companyId/decisions/:decisionId/reverse` | Issue & approve a `Reverse` decision (`reverses_id`) -> applies R5 withdrawal/review across same affected scope | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/decisions/:decisionId/ripple` | Return full R1-R5 ripple graph payload (nodes, edges, closed pass-through flags, distinct notified owners, execution progress summary, R4-redacted details) | Role A | scaffolded (M1; extend M2) |
| GET | `/api/v1/companies/:companyId/notifications` | Return current user's R3/R4/R5 impact notifications (with `Active` vs `Withdrawn_Review` state) | Role A | planned (P0) |
| GET | `/api/v1/companies/:companyId/audit-logs` | Admin/Manager: view approval, HR handoff, and decision lifecycle audit trail | Role A | planned (P1) |
| GET | `/api/v1/companies/:companyId/decisions/:decisionId/export` | Export clearance-filtered ripple & execution report (CSV/JSON) | Role A | planned (P1/P2) |
