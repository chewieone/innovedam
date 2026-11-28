# Database Schema

Database choice: PostgreSQL + Prisma ORM (decided 2026-11-28). Schema cleanly separates **PS-02 Workbook Entities** (matching the 5-sheet judge `.xlsx` contract) from **App-Layer Workspace Entities** (Auth, MyGate onboarding, HR explicit team assignments, role-bound successor handoff, and Team Lead execution progress).

> **Note on M1 vs M2 schema state:** The M1 scaffold in `server/prisma/schema.prisma` currently contains the core PS-02 + onboarding tables. Adding `role_seats`, `hr_team_assignments`, and `work_execution_progress` below is planned for M2 after planning review approval (no migrations have been run yet).

## Choice and rationale
- **Database:** PostgreSQL (managed via Neon/Supabase in cloud, local/Docker Postgres in dev).
- **ORM & Migrations:** Prisma ORM with Prisma Migrate (forward-only).
- **Rationale:** Preserves every PS-02 workbook column and foreign key (`manager_id`, `Dependencies`, `reverses_id`) verbatim while adding explicit app-layer tables so HR role scoping, successor inheritance, and execution progress never mutate or corrupt PS-02's `Open`/`Closed` (R3) or `Draft`/`Approved` (R1) rules.

## Tables

### PS-02 Workbook Tables (populated via Admin `.xlsx` upload or company authoring)
| Table | Purpose | Owner | Status |
| --- | --- | --- | --- |
| `employees` | Workbook `Employees` (`company_id`, `employee_code`, `user_id` nullable, `team`, `role`, `manager_id` self-FK, `clearance`) | Role C | scaffolded (M1) |
| `work_items` | Workbook `Work_Items` (`company_id`, `work_code`, `program_code`, `deliverable`, `owner_id`, `team`, `status` Open/Closed, `due_date`, `visibility`) | Role C | scaffolded (M1) |
| `dependencies` | Workbook `Dependencies` (`company_id`, `dependent_work_id`, `prerequisite_work_id`, `relationship`) | Role C | scaffolded (M1) |
| `decisions` | Workbook `Decisions` (`company_id`, `decision_code`, `occurred_at`, `program_code`, `root_work_id`, `decider_id` immutable original author, `decision_type`, `status` Draft/Approved, `visibility`, `reverses_decision_id`, `decision_text`) | Role C | scaffolded (M1) |
| `workbook_rules` | Workbook `Rules` (`company_id`, `rule_code`, `description`) | Role C | scaffolded (M1) |

### App-Layer Workspace & Tracking Tables (do not exist in `.xlsx`; never fabricated as workbook history)
| Table | Purpose | Owner | Status |
| --- | --- | --- | --- |
| `users` | Real auth accounts (`email`, `password_hash`, `full_name`, `is_demo`) | Role C / Role A | scaffolded (M1) |
| `companies` | Tenant workspaces created by a Company Admin (`name`, `slug`, `admin_user_id`) | Role C | scaffolded (M1) |
| `onboarding_requests` | MyGate-style join requests (`company_id`, `user_id`, `requested_team`, `requested_role`, `target_manager_id`, `claimed_employee_id`, `status`, `reviewed_by_user_id`, `reviewed_at`) | Role C / Role A | scaffolded (M1) |
| `role_seats` | Persistent role seats (`id`, `company_id`, `seat_code`, `seat_type`: `HR` / `TEAM_LEAD`, `active_user_id` nullable, `active_employee_id` nullable) enabling successor HR handoff without losing role-bound history | Role C | planned (M2) |
| `hr_team_assignments` | Explicit HR-to-team mappings (`id`, `company_id`, `role_seat_id`, `team`, `assigned_by_user_id`) so HR sees only assigned teams, never every team below in org hierarchy | Role C | planned (M2) |
| `work_execution_progress` | Team Lead (`role = Manager` in that team, or Admin) execution progress per resulting work item (`id`, `company_id`, `work_item_id` unique, `last_decision_id` nullable, `progress_state`: `Not_Started` / `In_Progress` / `Blocked` / `Completed`, `progress_percent`, `note`, `updated_by_employee_id`, `updated_at`), decoupled from `decisions.status` and `work_items.status` | Role C | planned (M2) |
| `impact_notifications` | Materialized per-decision, per-recipient notifications enforcing R1/R3/R4/R5 (`company_id`, `decision_id`, `recipient_employee_id`, `action_state`, `safe_context_summary`) | Role C / Role A | scaffolded (M1) |
| `impact_notification_items` | Join table linking each notification to specific `Open` affected `work_items` owned by that recipient (R3) | Role C / Role A | scaffolded (M1) |

## Relationships
- `companies.admin_user_id -> users.id`.
- `employees.company_id -> companies.id`; `employees.user_id -> users.id` (nullable, unique per `(company_id, user_id)`).
- `employees.manager_id -> employees.id` (nullable self-FK; top-level managers have `NULL` manager).
- `role_seats.company_id -> companies.id`, `active_user_id -> users.id` (nullable), `active_employee_id -> employees.id` (nullable). Updating `active_user_id` on an HR handoff transfers seat visibility to the successor HR without altering `decisions.decider_id`.
- `hr_team_assignments.role_seat_id -> role_seats.id`, `assigned_by_user_id -> users.id`.
- `work_items.owner_id -> employees.id`; `dependencies` joins `dependent_work_id` and `prerequisite_work_id` to `work_items.id`.
- `decisions.root_work_id -> work_items.id`, `decisions.decider_id -> employees.id` (immutable original decision author), `decisions.reverses_decision_id -> decisions.id` (nullable self-FK for R5).
- `work_execution_progress.work_item_id -> work_items.id` (one current progress row per `work_item_id`), `last_decision_id -> decisions.id` (nullable), `updated_by_employee_id -> employees.id`.
- `impact_notifications.decision_id -> decisions.id`, `recipient_employee_id -> employees.id`; `impact_notification_items` links `(notification_id, work_item_id)`.

## Constraints and indexes
- Every table uses a primary key (`id` UUID/CUID) plus `created_at` and `updated_at` timestamps.
- Composite unique constraints per company preserve stable workbook IDs across tenants/imports:
  - `(company_id, employee_code)` unique on `employees`
  - `(company_id, work_code)` unique on `work_items`
  - `(company_id, decision_code)` unique on `decisions`
  - `(company_id, dependent_work_id, prerequisite_work_id, relationship)` unique on `dependencies`
  - `(decision_id, recipient_employee_id)` unique on `impact_notifications` (distinct owner notification per decision per R3)
  - `(company_id, seat_code)` unique on `role_seats`
  - `(role_seat_id, team)` unique on `hr_team_assignments`
  - `(work_item_id)` unique on `work_execution_progress` (one unambiguous Team Lead execution progress state per work item)
- Foreign keys use explicit `onDelete` behavior (`Cascade` on `company_id` tenant teardown; `Restrict` on `decider_id` / `root_work_id`; `SetNull` on `manager_id` / `user_id`).
- Indexes on `company_id`, `employees(company_id, team)`, `employees(manager_id)`, `hr_team_assignments(role_seat_id, team)`, `work_items(company_id, owner_id)`, `work_items(company_id, team)`, `work_items(company_id, program_code)`, `dependencies(prerequisite_work_id)`, `dependencies(dependent_work_id)`, `decisions(company_id, status, root_work_id)`, `work_execution_progress(company_id, work_item_id)`, and `onboarding_requests(company_id, status, target_manager_id)`.

## Migrations
- Tool: Prisma Migrate (`npx prisma migrate dev` / `npx prisma migrate deploy`).
- Every schema change is a migration owned by Role C, reviewed by the team before merge.
- Migrations are forward-only; rollbacks use a new migration.

## Naming conventions
- Tables: lowercase plural `snake_case` (mapped via Prisma `@@map`).
- Columns: lowercase `snake_case` (mapped via `@map` where Prisma camelCase is used in TS).
- Foreign keys: `<singular_table>_id` (or explicit role prefix like `owner_id`, `manager_id`, `decider_id`, `root_work_id`).
- Enums:
  - `Clearance`: `Internal`, `Confidential`
  - `WorkItemStatus`: `Open`, `Closed`
  - `DecisionStatus`: `Draft`, `Approved`
  - `OnboardingStatus`: `Pending`, `Approved`, `Rejected`
  - `NotificationActionState`: `Active`, `Withdrawn_Review`
  - `RoleSeatType`: `HR`, `TEAM_LEAD`
  - `ExecutionProgressState`: `Not_Started`, `In_Progress`, `Blocked`, `Completed`

## Data validation
- Zod runtime schemas validate `.xlsx` sheets (`Employees`, `Work_Items`, `Dependencies`, `Decisions`, `Rules`) and API payloads before writes; PostgreSQL constraints serve as the final enforcement layer.
- Timestamps from workbooks (ISO local IST) are parsed cleanly and stored in PostgreSQL `timestamptz` with explicit IST handling (`+05:30`).
