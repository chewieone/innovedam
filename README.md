# test-repo

Shared hackathon repository for our six-member team. Every member clones this repo, opens it in Google Antigravity, and works on their own branch and module.

## Project overview
- Product objective: TODO - TEAM DECISION REQUIRED (see `.plans/product-spec.md`)
- Problem being solved: TODO - TEAM DECISION REQUIRED (see `.plans/problem-discovery.md`)
- Target users: TODO - TEAM DECISION REQUIRED

## Tech stack
TODO - TEAM DECISION REQUIRED. The stack is chosen in Phase 4 of `HACKATHON_WORKFLOW.md` and recorded in `ARCHITECTURE.md`. Do not add framework dependencies before that decision.

| Layer | Choice | Status |
| --- | --- | --- |
| Frontend framework | TODO | undecided |
| Styling | TODO | undecided |
| Backend framework | TODO | undecided |
| Database | TODO | undecided |
| Authentication | TODO | undecided |
| AI model/provider | TODO | undecided |
| Hosting | TODO | undecided |
| Testing | TODO | undecided |

## Setup instructions
1. Clone this repository.
2. Open the folder in Antigravity.
3. Copy `.env.example` to `.env` and fill in your own local values. Never commit `.env`.
4. Install dependencies: TODO - add after stack selection.
5. Restore project skills if missing: `npx skills experimental_install` (restores from `skills-lock.json`).

## Run instructions
TODO - add after the initial skeleton (Phase 7) exists.

## Repository structure
| Path | Contents |
| --- | --- |
| `AGENTS.md` | Central instructions every coding agent reads first |
| `.agents/rules/` | Shared project rules loaded by Antigravity |
| `.agents/skills/` | Project-level third-party skills (installed via Skills CLI) |
| `.plans/` | Discovery and specification documents |
| `ARCHITECTURE.md` | System design and module boundaries |
| `API_CONTRACT.md` | API conventions and endpoint contracts |
| `DATABASE_SCHEMA.md` | Schema, relationships, migrations |
| `UI_GUIDELINES.md` | Design tokens and component conventions |
| `CONTRIBUTING.md` | Branching, commits, PRs, reviews |
| `TASKS.md` | Feature list, ownership, status |
| `HACKATHON_WORKFLOW.md` | End-to-end 12-phase team process |
| `SKILL_CATALOG.md` | Every installed skill, source, license, status |
| `SKILL_USAGE.md` | When and by whom each skill is used |
| `THIRD_PARTY_NOTICES.md` | Attribution for third-party skills |

## Team roles
| Member | Role | Owns |
| --- | --- | --- |
| 1 | Tech Lead / Integration | architecture, repo, PR reviews, integration, deployment |
| 2 | Frontend Developer | UI, pages, components, state, responsive design |
| 3 | Backend Developer | API, business logic, validation, auth integration |
| 4 | AI/ML Developer | AI features, LLM integration, prompts (or integrations if no AI) |
| 5 | Database Engineer | schema, migrations, constraints, query optimisation |
| 6 | QA / Testing / DevOps | test strategy, CI/CD, code quality, security checks |

Each task has exactly one primary owner. Members may help each other; ownership does not move without the Tech Lead.

## Development workflow
See `HACKATHON_WORKFLOW.md` (full process) and `CONTRIBUTING.md` (Git rules). Branches: `main` (stable), `develop` (integration), `feat/<module>` per member. All merges to `develop` go through pull requests.
