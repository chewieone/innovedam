---
trigger: model_decision
description: Testing expectations when writing features, fixing bugs or preparing PRs.
---
# Testing

1. Relevant tests pass before every PR. There is no "I'll test after merge".
2. Every feature ships with the tests its TASKS.md row lists.
3. Test stack: TODO - TEAM DECISION REQUIRED (Phase 4). Until then do not add test frameworks.
4. Priority order: P0 user journeys, auth flows, API contracts, database operations, error cases.
5. Member 6 owns the test strategy and CI checks; help is welcome, ownership stays.
6. Bugs get a regression test with the fix.
7. Functional correctness outranks animation and decorative polish (Phase 10).
