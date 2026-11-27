---
trigger: always_on
description: Non-negotiable security and secret-handling rules for all work.
---
# Security rules

1. Never commit .env files, API keys, tokens, passwords, database credentials or personal authentication data.
2. Never put credentials into AGENTS.md, SKILL.md, README.md, docs, issues or PR descriptions.
3. All members use their own local environment variables from .env.example.
4. Use sandbox or development accounts for external services.
5. Validate all input on the server side. The database is the last line of defence, not the only one.
6. Before committing, check the diff for secrets (see git-workflow-and-versioning skill).
7. Do not expose .env contents or secrets to any skill, subagent or external tool.
8. Security-sensitive flows (auth, sessions, input handling) get a security review before merging; use the OWASP security-review skills.
