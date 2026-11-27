# Hackathon Workflow

The end-to-end process for all six members. Twelve phases. Do not skip phases 1-5: parallel coding without agreed contracts is how integrations fail.

## Phase 1 - Understand the problem (all members)
Read the problem statement, theme and judging criteria. Use the JMO `interview` skill for structured discovery; answers land in `.plans/problem-discovery.md`. Research target users, pain points, existing solutions and their gaps. No production coding.

## Phase 2 - Brainstorm and select the idea (all members)
Each member contributes ideas. Score against feasibility, innovation, usefulness, difficulty, time, judging criteria, demo potential. Choose one. Define product objective, target audience, core value proposition, USP, major use cases. Output: `.plans/product-spec.md`.

## Phase 3 - Define the MVP
List every proposed feature. Classify P0 (necessary) / P1 (important) / P2 (nice) / P3 (only if time). Acceptance criteria for every P0. Tech Lead coordinates final scope. Output: `.plans/mvp-scope.md`. Attempt fewer features than feels comfortable.

## Phase 4 - Select the technology stack
Agree: frontend framework, styling, backend framework, database, authentication, AI model/provider (if needed), external APIs, hosting, testing, deployment. Record in `ARCHITECTURE.md` and `.plans/technical-decisions.md`. After this phase, deferred framework-specific skills are installed (see `SKILL_CATALOG.md`). No unilateral changes afterwards.

## Phase 5 - Design before parallel coding
Define high-level architecture, module responsibilities, folder structure, API contracts, database schema, design system, auth flow, error handling, environment variables. Create mock API responses where dependencies lag. Build shared UI primitives before separate pages. Tech Lead approves architecture and contracts.

## Phase 6 - Development environment (this repository)
Repo, docs, rules, skills, branches already exist. Each member: clone, open in Antigravity, verify skills discovered, verify project instructions load, set up `.env`. No major feature work until every member's setup is verified.

## Phase 7 - Initial skeleton
Module owners build the runnable minimum: Member 1 integration plan and shared config; Member 2 app shell, layout, shared components, navigation; Member 3 backend server with a health-check endpoint (path decided in Phase 5) and initial API structure; Member 4 AI service structure with a connectivity test (or integration scaffolding); Member 5 database connection and initial migrations; Member 6 test framework, CI checks, smoke tests, bug workflow.

## Phase 8 - Parallel development
Each member on their `feat/` branch: pull latest `develop`, state role and task to Antigravity, read the relevant docs, invoke the relevant skill, review the agent's plan before accepting, implement only the assigned feature, run tests, commit, push, open a PR. One primary owner per task. Communicate blockers and shared-file needs early. Six human developers, not six AI subagents; use subagents only for clearly bounded independent tasks.

## Phase 9 - Continuous integration
Integrate throughout, not at the end. Tech Lead coordinates PR reviews, API compatibility, schema consistency, shared components, environment config, merge conflicts, build checks. Member 6 verifies with automated tests. Contract changes are announced before dependents continue. The app stays runnable after every major merge.

## Phase 10 - Testing and polish
Test complete user journeys, auth, API, database, AI responses, responsive UI, error cases, security-sensitive flows, browser compatibility, performance. Use better-ui / animate / agentation (if approved) for polish. Correctness before decoration. P0 bugs before P2/P3 features.

## Phase 11 - Deployment
Production env vars configured, secrets verified absent from git, deployment configured, production build, deployed smoke test, database and external service checks, full demo flow. Document the exact steps.

## Phase 12 - Demo and presentation
Problem, solution, live demo, architecture, technology choices, innovation, impact, future scope. Prepare a backup demo plan (recorded video / local data) for internet or service failure.
