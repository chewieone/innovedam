# Problem Discovery

Phase 1 output. Method: structured `/interview` with product lead, grounded in `PS02_Ripple_Effect.xlsx` structure and `Rules`. Every unanswered item is `TODO - TEAM DECISION REQUIRED`.

## Hackathon context
- Problem statement (official text): TODO - TEAM DECISION REQUIRED (full official narrative text for PS-02 "The Ripple Effect" was not present in the attached workbook data or repository files; workbook metadata states Purpose: "Identify direct and indirect affected work and recipients; distinguish draft and approved decisions.")
- Theme and judging criteria: TODO - TEAM DECISION REQUIRED (design must handle arbitrary judge datasets matching the 5-sheet PS-02 schema and Rules R1-R5, not hardcoded sample rows)
- Total time and key deadlines: 24-hour sprint; target submission date 2026-11-29 (exact submission cutoff time: TODO - TEAM DECISION REQUIRED)
- Required or prohibited technologies/APIs: TODO - TEAM DECISION REQUIRED (no prohibited APIs reported; team selected a self-contained stack with no external AI/API dependencies in MVP)

## Problem and users
- Target users:
  - Company Admins setting up an organization, importing/managing org structure, work items, dependencies, decisions, and assigning HR team scopes / role handoffs.
  - HR role seats tracking decision follow-through and execution progress strictly across the teams explicitly assigned to them (inheriting role-bound history across HR transitions without inheriting entire downward hierarchy trees).
  - Team Leads (`Manager` / team leads) updating execution progress on their team's resulting work after decisions land.
  - Managers / Higher-ups reviewing and approving pending member onboarding requests (MyGate-style).
  - Employees across `Internal` and `Confidential` clearance levels (`Manager`, `Specialist`, `Associate`) tracking their team, work items, and incoming decision ripples.
- Problem being solved and pain points:
  - Business decisions cascade unpredictably across dependent deliverables and teams (R1-R5).
  - Teams struggle to separate non-triggering `Draft` proposals from `Approved` decisions (R1), handle `Reverse` decisions (R5), traverse through `Closed` work without mis-notifying closed-item owners (R3), and protect `Confidential` decisions affecting `Internal` downstream owners (R4).
  - Approving a decision does not mean teams have finished executing the resulting work; decision lifecycle (`Draft` / `Approved` / `Reversed`) is conflated with team execution progress.
  - When an HR representative transitions or is replaced, decision follow-through is lost if tied to a personal account rather than the HR role/team assignment—yet an HR role must only see explicitly assigned teams rather than every team in an org tree.
  - New or onboarding employees lack a scoped view of their team deliverables and active decision ripples, forcing them to start from zero.
- Existing solutions and their limitations:
  - Static spreadsheets (`Employees`, `Work_Items`, `Dependencies`, `Decisions`) have no HR team-assignment model, no role-inherited follow-through, and no execution-progress tracking separate from binary `Open`/`Closed` status.
  - Generic project trackers do not enforce PS-02's exact R1-R5 rules (closed pass-through traversal without closed-item notification, distinct owner aggregation, clearance-safe action context, and reversal scope withdrawal) or role-inherited HR tracking with strict R4 redaction.

## Opportunities
- Gaps identified:
  - Need a deterministic, cycle-safe graph traversal engine enforcing R1-R5 across the full dependency graph on any schema-valid PS-02 workbook without cutting off traversal due to team/HR assignment filters.
  - Need app-layer extensions (HR explicit team assignments, role-bound decision follow-through, and team lead execution progress) that complement—never replace—PS-02's core workbook schema and Rules.
  - Need server-enforced R4 clearance redaction and original-author preservation even when a successor HR inherits role-bound decision history.
- Initial solution opportunities:
  - Full-stack web app (Vite + React + TS, Express + TS, PostgreSQL + Prisma) uniting the PS-02 R1-R5 ripple solver with company creation, MyGate onboarding, HR assigned-teams tracking, role-inherited follow-through, and Team Lead execution progress.
