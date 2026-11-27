# Architecture

Status: TODO - TEAM DECISION REQUIRED for the stack (Phase 4) and system design (Phase 5). Sections below are the agreed structure; fill them during Phase 5 before parallel coding.

## System overview
TODO - one diagram or paragraph: client, API, database, AI service, external services.

## Frontend architecture
- Framework: TODO
- State management: TODO
- Folder structure: TODO
- Shared UI primitives live in: TODO (owned by Member 2; built before separate pages, per Phase 5)

## Backend architecture
- Framework: TODO
- Layering (routes / services / data access): TODO
- Error handling convention: TODO
- Request validation library: TODO

## AI service architecture
- Required? TODO - TEAM DECISION REQUIRED
- Provider/model: TODO
- Prompt and evaluation approach: TODO
- If no AI: Member 4 owns external integrations / data processing instead (record which).

## Database architecture
- Database: TODO
- Access pattern (ORM/query layer): TODO
- Migration tool: TODO

## External integrations
TODO - list each external API, its owner, and its sandbox/development account.

## Module communication
- Frontend <-> backend: HTTP/JSON per `API_CONTRACT.md`.
- Backend <-> database: per `DATABASE_SCHEMA.md`.
- Backend <-> AI service: TODO
- Mock API responses are created where a dependency is not ready (Phase 5).

## Deployment architecture
TODO - hosting, environments, CI/CD pipeline (Phase 11).
