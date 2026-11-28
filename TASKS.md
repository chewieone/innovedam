# Tasks

Status: Updated 2026-11-28 to reflect completed M1 scaffold checkpoint and revised M2 planning requirements (HR explicit team assignments, role-bound successor continuity, separated Team Lead execution progress). M2 implementation is paused pending planning review. Individual member names: `TODO - TEAM DECISION REQUIRED`.

## Milestones
| Milestone | Phase | Target |
| --- | --- | --- |
| M0 Foundation: repo, docs, rules, `.env` template verified on all 3 laptops | 6 | 2026-11-28 (complete) |
| M1 Skeleton: `client/`, `server/`, `shared/`, Prisma schema, `/api/v1/health`, auth & R1-R5/R4 scaffold tests | 7 | 2026-11-28 (checkpoint complete; builds & 7 tests passing) |
| M2 MVP complete: all P0 features integrated and passing R1-R5, HR scoping & progress tests | 8-9 | 2026-11-29 (paused pending planning review; exact cutoff hour: TODO - TEAM DECISION REQUIRED) |
| M3 Tested and polished: Vitest + Supertest suite, R4 & BOLA security review, judge `.xlsx` test | 10 | 2026-11-29 |
| M4 Deployed and demo-ready: single-origin cloud deploy + seeded synthetic demo verification | 11-12 | 2026-11-29 |

## Setup baseline (M0)
| Task | Owner | Depends on | Status |
| --- | --- | --- | --- |
| Clone repo, open in Antigravity, verify `AGENTS.md` loads | all (3 members) | repo access | done |
| Verify project skills discovered in Antigravity | all (3 members) | skills installed | done |
| Configure local `.env` from `.env.example` and verify PostgreSQL connection | all (3 members) | stack decision | open |
| Assign member names to Role A, Role B, Role C and create working branches | all (3 members) | repo access | open |

## Feature list
| ID | Feature | Priority (P0-P3) | Owner | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| F01 | Shared TypeScript contracts & Zod schemas (`shared/`) | P0 | Role A + Role C | M0 | scaffolded (extend in M2 for HR/progress DTOs) |
| F02 | PostgreSQL + Prisma schema, migrations & synthetic demo seed (`Internal`, `Confidential`, HR, Team Lead) | P0 | Role C | F01 | schema scaffolded; add M2 tables & migrate after review |
| F03 | Auth (`bcrypt` + `HttpOnly` JWT cookie: register, login, logout, `/auth/me`) + Company creation | P0 | Role A | F02 | auth routes scaffolded; DB persistence in M2 |
| F04 | Schema-validated `.xlsx` workbook importer (`Employees`, `Work_Items`, `Dependencies`, `Decisions`, `Rules`) | P0 | Role C | F01, F02 | open (M2) |
| F05 | Deterministic full-graph R1-R5 ripple engine, R4 server redaction & notification generator | P0 | Role A | F01, F02 | core engine & R4 tests passing (M1); DB wiring in M2 |
| F06 | MyGate-style manager-approval onboarding API (join request, pending queue, approve/reject) | P0 | Role A | F02, F03 | open (M2) |
| F07 | Explicit HR team assignments, role-bound successor handoff & BOLA/clearance guards | P0 | Role A | F01, F02, F05 | open (M2) |
| F08 | Team Lead execution progress API (`PATCH /work-items/:workId/progress`, decoupled from `Approved` & `Open`/`Closed`) | P0 | Role A | F01, F02 | open (M2) |
| F09 | Shared Tailwind UI primitives, app shell & auth/onboarding screens (incl. Pending screen) | P0 | Role B | F01 | base primitives scaffolded (M1); full views in M2 |
| F10 | Scoped workspace views (`My Team`, `My Work` + progress controls, `My Decisions`, `HR Assigned Teams`) & Admin UI | P0 | Role B | F03-F09 | open (M2) |
| F11 | Interactive React Flow (`@xyflow/react`) PS-02 ripple graph view & live decision authoring (`Draft`/`Approve`/`Reverse`) | P0 | Role B + Role A | F05, F09 | open (M2) |
| F12 | Vitest + Supertest suite (R1-R5, cycles, R4 redaction, HR assignment isolation, successor handoff, progress decoupling, `.xlsx` validation) | P0 | Role C | F04-F08 | M1 baseline (7 tests) passing; expand in M2 |
| F13 | Single-origin cloud deploy (Render/Railway + Neon/Supabase) | P0 | Role C | F03-F12 | open (M4) |
| F14 | Audit log of onboarding approvals, HR seat transfers, imports & decision transitions | P1 | Role A + Role C | F05-F07 | open |
| F15 | Downloadable clearance-filtered ripple & execution progress report (CSV/JSON) | P1/P2 | Role B | F05, F10 | open |
| F16 | What-if / Draft preview simulation (non-triggering per R1) | P2 | Role A + Role B | F05, F11 | open |

## Bug reports
File bugs in the tracker agreed by the 3-person team (GitHub Issues or `TASKS.md` rows): TODO - TEAM DECISION REQUIRED. Role C coordinates QA triage.
