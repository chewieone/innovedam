# Database Schema

Database choice: TODO - TEAM DECISION REQUIRED (Phase 4). Do not invent final schemas before the team agrees; tables below are placeholders from discovery, not commitments.

## Choice and rationale
TODO - database, hosting, why it fits the product and hackathon time.

## Tables
| Table | Purpose | Owner | Status |
| --- | --- | --- | --- |
| TODO | added in Phase 5 from the MVP scope | Member 5 | undecided |

## Relationships
TODO - entity-relationship summary in Phase 5.

## Constraints and indexes
- Every table: primary key, created_at/updated_at: TODO - confirm convention in Phase 5.
- Foreign keys with explicit on-delete behaviour.
- Indexes for every foreign key and every query pattern in the MVP flows.

## Migrations
- Tool: TODO - after database choice.
- Every schema change is a migration owned by Member 5, reviewed by the Tech Lead.
- Migrations are forward-only; rollbacks use a new migration.

## Naming conventions
- Tables: lowercase plural snake_case.
- Columns: lowercase snake_case.
- Foreign keys: `<singular_table>_id`.
TODO - confirm in Phase 5.

## Data validation
Database constraints mirror API validation; the database is the last line of defence, not the only one.
