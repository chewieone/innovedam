# API Contract

Conventions are agreed now. Endpoints: TODO - added in Phase 5. Do not invent endpoints here or in code.

## Conventions
- Base path: `/api`. Version prefix: TODO (e.g. `/api/v1`) - TEAM DECISION REQUIRED.
- Resource naming: lowercase plural nouns, kebab-case for multi-word (`/api/team-members`).
- JSON request and response bodies, `Content-Type: application/json`.
- Timestamps: ISO 8601 UTC.

## Methods
| Method | Use | Success status |
| --- | --- | --- |
| GET | read, no side effects | 200 |
| POST | create / actions | 201 (create) or 200 |
| PATCH | partial update | 200 |
| PUT | full replace | 200 |
| DELETE | remove | 204 |

## Request schemas
- Validate every field on the server; reject unknown fields: TODO - validation library after stack decision.
- Pagination for lists: `?page=&limit=`, response carries `items`, `page`, `total`: TODO - confirm in Phase 5.

## Response schemas
Success: the resource (or list envelope) directly, no wrapper: TODO - confirm in Phase 5.

## Error format
Single agreed shape:
```
{ "error": { "code": "MACHINE_READABLE_CODE", "message": "Human-readable summary", "details": [ ...optional field errors... ] } }
```
Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 500 unexpected.

## Authentication
TODO - TEAM DECISION REQUIRED (provider, token transport, session model). All endpoints default to authenticated unless marked public.

## API ownership
Member 3 owns API implementation; Member 1 owns this contract. Any change to an endpoint, schema or error code requires updating this file first and announcing the change before dependents continue.

## Endpoint registry
| Method | Path | Purpose | Owner | Status |
| --- | --- | --- | --- | --- |
| GET | TODO - TEAM DECISION REQUIRED | health check (the brief requires a health-check endpoint in Phase 7 but does not specify its path) | Member 3 | planned (Phase 7 skeleton) |
