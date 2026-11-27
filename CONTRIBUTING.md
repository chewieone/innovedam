# Contributing

## Branches
| Branch | Purpose | Who commits |
| --- | --- | --- |
| `main` | stable, demo-ready application | merges from `develop` only, Tech Lead approval |
| `develop` | shared integration branch | PR merges only |
| `feat/integration` | Member 1 | Member 1 |
| `feat/frontend` | Member 2 | Member 2 |
| `feat/backend` | Member 3 | Member 3 |
| `feat/ai-service` | Member 4 | Member 4 |
| `feat/database` | Member 5 | Member 5 |
| `feat/testing` | Member 6 | Member 6 |

No direct commits to `main`. Feature branches merge into `develop` through pull requests.

## Commits
Conventional-commit style: `feat: add health endpoint`, `fix: null guard in login form`, `docs: update API contract`, `test: add auth flow spec`, `chore: bump deps`, `refactor: extract card component`. Small, atomic, reviewable.

## Pull requests
- One PR per task row in `TASKS.md`. Link the task.
- Description: what changed, why, how tested, contract impact (API/schema/UI) if any.
- Checks pass before review: build, relevant tests, lint: TODO - exact CI checks in Phase 6-7.

## Reviews
- Tech Lead reviews every PR into `develop`; the module owner reviews cross-module changes.
- Review for contract compliance (`API_CONTRACT.md`, `DATABASE_SCHEMA.md`, `UI_GUIDELINES.md`), not personal style.
- Use the installed code-review skill for the first pass; the human reviewer decides.

## Merge rules
- Squash or rebase merge: TODO - TEAM DECISION REQUIRED (pick one and keep it).
- Never merge a red build. Keep `develop` runnable after every merge.

## Syncing and conflicts
- Pull `develop` into your feature branch at the start of each work session.
- Conflict on a shared file (contracts, shared components, config): stop and coordinate with the file's owner before resolving.
- Re-run migrations after pulling schema changes.

## Contract changes
API or schema change = update the contract doc in the same PR, announce it before dependents continue, and get Tech Lead approval.

## Rolling back
Broken merge to `develop`: revert the merge commit immediately, then fix forward on the feature branch. Do not patch `develop` under time pressure.

## Integration responsibilities
Member 1 coordinates integration windows and announces them. Member 6 verifies each integration with automated tests.
