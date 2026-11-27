# Skill Usage

Skills live in `.agents/skills/` and are discovered by Antigravity automatically. Invoke by working on a matching task (the agent reads the skill itself) or by naming it. This file says when each skill should be in play.

## Planning phase (Phases 1-2)
| Skill | Who | When |
| --- | --- | --- |
| interview | Member 1 leads, all answer | Structured discovery; produces `.plans/` specs |
| ste | anyone | Any explanation or doc that reads confused |

## Building phases (Phases 5-9)
| Skill | Who | When |
| --- | --- | --- |
| api-and-interface-design | Members 1, 3 | Designing or changing any endpoint or module boundary |
| diagnosing-bugs | anyone | Something broke and the cause is not obvious |
| git-workflow-and-versioning | everyone | Every commit, branch, PR |
| web-security-review | Members 1, 6 | Before merging auth, input handling, session code |
| api-security-review | Members 1, 3, 6 | Before merging API surface changes |

## Review and polish phases (Phases 9-10)
| Skill | Who | When |
| --- | --- | --- |
| code-review-and-quality | Member 1, reviewers | Every PR into `develop`, first pass |
| better-ui | Members 2, 6 | UI polish pass on surfaces, icons, motion |
| animate | Member 2 | Building any animation or transition |

## Manual / optional
| Skill | Who | When |
| --- | --- | --- |
| agentation | Members 2, 6 | Only after team approves its license and the stack is Next.js |
| codex | Member 1 | Only if the team installs and approves Codex CLI |

Automatic vs manual: discovery is automatic, but treat interview (Phase 1), code-review-and-quality (each PR), and the security reviews (before merges they cover) as required steps in `HACKATHON_WORKFLOW.md`, not optional suggestions. Dependencies: none of the installed skills need extra runtimes or accounts except the two optional rows above.
