---
trigger: model_decision
description: Branching, commit, pull request and merge rules when committing, branching or opening PRs.
---
# Git workflow

1. Branches: main (stable), develop (integration), feat/<module> per member. No direct commits to main.
2. Pull latest develop into your feature branch at the start of each work session.
3. Conventional-commit style messages: feat:, fix:, docs:, test:, chore:, refactor:.
4. Small atomic commits; one PR per TASKS.md row.
5. Every merge into develop goes through a PR reviewed by the Tech Lead.
6. Contract changes (API/schema) update the contract doc in the same PR and are announced before dependents continue.
7. Merge conflicts on shared files: coordinate with the file owner before resolving.
8. Broken merge on develop: revert first, fix forward on the feature branch.
9. Full details: CONTRIBUTING.md.
