---
trigger: model_decision
description: API and database contract requirements when touching endpoints, schemas, migrations or data access.
---
# API and database contracts

1. Every endpoint follows API_CONTRACT.md: methods, naming, request/response schemas, error format, auth. Do not invent endpoints outside the contract.
2. Every schema change is a migration owned by Member 5 and reflected in DATABASE_SCHEMA.md.
3. Foreign keys carry explicit on-delete behaviour; indexes cover foreign keys and MVP query patterns.
4. Changing a shared contract: update the contract doc first, get Tech Lead approval, announce before dependents continue.
5. Mock API responses bridge unfinished dependencies (Phase 5); mark mocks clearly and remove them before Phase 11.
