---
trigger: model_decision
description: Coding standards for writing or modifying application code in any module.
---
# Coding standards

1. Follow the module's existing patterns before introducing new ones.
2. Small, single-purpose functions and modules. Modules communicate only through the contracts in API_CONTRACT.md and DATABASE_SCHEMA.md.
3. Errors are handled, not swallowed. Server errors follow the API_CONTRACT.md error shape.
4. Validate request input at the boundary with the agreed validation library (Phase 4 decision).
5. No commented-out dead code, no leftover debug logging in commits.
6. Name things after the domain, not the implementation.
7. Framework-specific style rules are added here after the Phase 4 stack decision: TODO - TEAM DECISION REQUIRED.
