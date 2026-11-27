# Skill Catalog

Installation status legend: `installed` (approved and installed 2026-11-28), `deferred` (install after the Phase 4 stack decision), `flagged` (needs explicit team approval for the stated reason), `skipped` (not installed, reason recorded).

## JMO skills (source repo: https://github.com/23jmo/jmo-skills, root license MIT)

| Skill | Category | Source URL | Purpose | Main users | Dependencies | License | Antigravity compatibility | Status | Source revision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| interview | planning | https://github.com/23jmo/jmo-skills/tree/main/skills/interview | Structured discovery interviews, writes specs to `.plans/` | Member 1, all (Phases 1-2) | none | MIT (repo root) | Compatible; Claude-only `allowed-tools` frontmatter key and AskUserQuestionTool reference are inert, agent asks in conversation | installed | main @ 2026-10-10 |
| ste | communication | https://github.com/23jmo/jmo-skills/tree/main/skills/ste | Clear, precise technical writing | all six | none | MIT (repo root) | compatible | installed | main @ 2026-10-10 |
| better-ui | UI polish | https://github.com/23jmo/jmo-skills/tree/main/skills/better-ui (upstream https://github.com/jakubkrehel/skills) | Exact-value polish for surfaces, icons, motion | Members 2, 6 | none | MIT (bundled LICENSE) | compatible; references sibling skills not bundled, self-contained | installed | upstream d574cc8 (UPSTREAM.json) |
| animate | UI animation | https://github.com/23jmo/jmo-skills/tree/main/skills/animate (upstream https://github.com/emilkowalski/skills) | Build purposeful animations with exact curves/durations | Member 2 | none | MIT (bundled LICENSE) | compatible; names sibling skills it does not cover | installed | upstream e8a175d (UPSTREAM.json) |
| agentation | UI feedback | https://github.com/23jmo/jmo-skills/tree/main/skills/agentation (upstream https://github.com/benjitaylor/agentation) | Visual feedback toolbar on page elements | Members 2, 6 | npm `agentation`, optional MCP server `agentation-mcp`, Next.js + React 18+ | PolyForm Shield 1.0.0 (non-OSI, no competing with licensor) | compatible skill format; needs Next.js specifically, which is undecided (React is chosen) | installed (skill only, approved 2026-11-28 under the disclosed PolyForm Shield license; npm package and MCP server deferred until the Next.js decision) | upstream 0e3236e (UPSTREAM.json) |
| codex | delegation | https://github.com/23jmo/jmo-skills/tree/main/skills/codex | Hand off review/second opinion to Codex CLI | Member 1 | Codex CLI installed and signed in | MIT (repo root) | compatible, manual invocation only | skipped unless team approves Codex CLI | main @ 2026-10-10 |

## skills.sh skills

| Skill | Category | Source URL | Purpose | Main users | Dependencies | License | Antigravity compatibility | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| api-and-interface-design | api-design | https://github.com/addyosmani/agent-skills/tree/main/skills/api-and-interface-design | REST/GraphQL contracts, module boundaries, versioning, errors | Members 1, 3 | none | MIT | compatible (name+description frontmatter) | installed |
| code-review-and-quality | code-review | https://github.com/addyosmani/agent-skills/tree/main/skills/code-review-and-quality | Five-axis review before merge | Member 1, all | none | MIT | compatible | installed |
| git-workflow-and-versioning | git-workflow | https://github.com/addyosmani/agent-skills/tree/main/skills/git-workflow-and-versioning | Branching, atomic commits, PR flow, secret-scan before commit | all six | none | MIT | compatible | installed |
| diagnosing-bugs | debugging | https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs | Structured root-cause diagnosis loop | all six | none | MIT | compatible | installed |
| web-security-review | security-review | https://github.com/OWASP/secure-agent-playbook/tree/main/plugins/code-security-skills/skills/web-security-review | OWASP Top 10 (web) review with playbook | Members 1, 6 | none | CC-BY-4.0 (repo LICENSE.md) | compatible | installed |
| api-security-review | security-review | https://github.com/OWASP/secure-agent-playbook/tree/main/plugins/code-security-skills/skills/api-security-review | OWASP API Security Top 10 review | Members 1, 3, 6 | none | CC-BY-4.0 (repo LICENSE.md) | compatible | installed |

## Deferred until Phase 4 stack decision (leading candidates, not installed)

| Category | Leading candidate | Condition |
| --- | --- | --- |
| frontend-development | vercel-labs/agent-skills `vercel-react-best-practices` (note: repo has no LICENSE file; frontmatter claims MIT; needs team OK) | React is chosen; candidate matches, but install still needs team approval given the missing repo LICENSE |
| backend-development | wshobson/agents `nodejs-backend-patterns` or mcollina/skills `fastify-best-practices` | backend framework chosen |
| database-engineering | supabase/agent-skills `supabase-postgres-best-practices` (MIT, Postgres anywhere) | Postgres/Supabase chosen |
| ai-ml-development | vercel/ai `ai-sdk` | product needs AI AND Vercel AI SDK chosen |
| authentication | mcollina/skills `oauth` (Fastify-specific) | auth approach chosen |
| testing | currents-dev `playwright-best-practices` (E2E), antfu/skills `vitest` (unit) | test frameworks chosen |
| deployment | none suitable found; record unavailable until hosting chosen | hosting chosen |

Install method for every skill: `npx skills add <owner/repo> --skill <name> --agent antigravity` from the repo root (project scope, writes `.agents/skills/`, maintains `skills-lock.json`). Verify with `npx skills list` and by checking the directory. Restore on a fresh clone: `npx skills experimental_install`.
