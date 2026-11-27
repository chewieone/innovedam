# AGENTS.md - central instructions for every coding agent

Read this file and the documents it points to before editing any code in this repository.

## Project context
Six-member hackathon team. Product idea and stack: TODO - TEAM DECISION REQUIRED (see `.plans/`). Until those are decided, do not add application dependencies or scaffold app code.

## Team structure and file ownership
- Member 1 (Tech Lead): architecture, `ARCHITECTURE.md`, `API_CONTRACT.md`, integration, PR reviews.
- Member 2 (Frontend): UI pages, components, `UI_GUIDELINES.md`.
- Member 3 (Backend): API implementation, business logic, validation.
- Member 4 (AI/ML): AI service, prompts, model integration (or external integrations if no AI).
- Member 5 (Database): `DATABASE_SCHEMA.md`, migrations, indexes.
- Member 6 (QA/DevOps): tests, CI/CD, security checks.
Never modify another member's module or a shared contract file without coordinating in the PR and with the owner.

## Technology stack
TODO - TEAM DECISION REQUIRED. Recorded in `ARCHITECTURE.md` after Phase 4. Do not change selected technologies without team agreement.

## Architecture principles
- Modules communicate only through the contracts in `API_CONTRACT.md` and `DATABASE_SCHEMA.md`.
- Shared interfaces change only with Tech Lead approval, and the change is announced before dependent members continue.
- Keep the application runnable after every merge to `develop`.

## Coding conventions
- Follow `.agents/rules/coding-standards.md`.
- Small, reviewable commits with conventional-commit style messages (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- No unapproved dependencies. Propose additions to the Tech Lead first.

## Skill usage
- Project skills live in `.agents/skills/`; see `SKILL_CATALOG.md` and `SKILL_USAGE.md`.
- Use the `interview` skill during planning, `ste` for unclear writing, `better-ui`/`animate` for UI polish, and the installed engineering skills for their domains.
- Third-party skills are read-only: do not edit their contents or remove copyright notices.

## API contract requirements
Every endpoint follows `API_CONTRACT.md`: naming, request/response schemas, error format, auth. Do not invent endpoints outside the contract; add them to the contract first.

## Database requirements
Schema, tables, constraints and indexes follow `DATABASE_SCHEMA.md`. All schema changes go through migrations owned by Member 5.

## UI guidelines
All interface work follows `UI_GUIDELINES.md`: tokens, spacing, components, accessibility, motion.

## Security rules
- Never commit `.env`, API keys, tokens, passwords or any credentials. See `.agents/rules/security.md`.
- Validate all input on the server. Use sandbox/development accounts for external services.

## Testing expectations
- Relevant tests pass before every PR. See `.agents/rules/testing.md`.
- Member 6 owns the test strategy; every feature ships with the tests its row in `TASKS.md` lists.

## Git workflow
Branches and PR rules: `CONTRIBUTING.md`. No direct commits to `main`.

## Integration policy
Integration is continuous (Phase 9 of `HACKATHON_WORKFLOW.md`). Contract changes are announced before dependents continue. Broken merges are rolled back, not patched forward under time pressure.
