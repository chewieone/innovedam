# Third-Party Notices

This repository bundles third-party agent skills under `.agents/skills/`. Original skill instructions are unmodified. Two traceable additions, both unmodified copies of upstream files: (1) each source repository's license file was copied beside any installed skill whose directory lacked one (MIT for the JMO, addyosmani and mattpocock skills; CC-BY-4.0 as LICENSE.md for the OWASP skills); (2) the two OWASP skills reference playbook files that live outside their skill directories upstream, so plays/owasp-top10-web-review.md and plays/api-security-review.md were copied into web-security-review/plays/ and api-security-review/plays/, matching the relative paths the skills name. Modifications to skill instructions: none.

## JMO skills
Repository: https://github.com/23jmo/jmo-skills, author Johnathan Mo, root license MIT (applies to his original work: interview, ste, codex).

| Skill | Original author | Source | License | Attribution requirements | Restrictions |
| --- | --- | --- | --- | --- | --- |
| interview, ste, codex | Johnathan Mo | https://github.com/23jmo/jmo-skills | MIT | retain copyright notice | none beyond MIT |
| better-ui | Jakub Krehel | https://github.com/jakubkrehel/skills (pinned d574cc8) | MIT (bundled LICENSE) | retain copyright notice | none beyond MIT |
| animate | Emil Kowalski | https://github.com/emilkowalski/skills (pinned e8a175d) | MIT (bundled LICENSE) | retain copyright notice | none beyond MIT |
| agentation | Benji Taylor | https://github.com/benjitaylor/agentation (pinned 0e3236e) | PolyForm Shield 1.0.0 (bundled LICENSE) | retain license and notices | may not be used to compete with the licensor's products; distribution must include the license. Skill installed 2026-11-28 with team lead approval of the disclosed license; its npm package and MCP server are not set up. |

## skills.sh skills
| Skill | Author | Source | License | Attribution requirements | Restrictions |
| --- | --- | --- | --- | --- | --- |
| api-and-interface-design, code-review-and-quality, git-workflow-and-versioning | Addy Osmani | https://github.com/addyosmani/agent-skills | MIT | retain copyright notice | none beyond MIT |
| diagnosing-bugs | Matt Pocock | https://github.com/mattpocock/skills | MIT | retain copyright notice | none beyond MIT |
| web-security-review, api-security-review | OWASP Foundation | https://github.com/OWASP/secure-agent-playbook | CC-BY-4.0 | credit the OWASP Foundation, link the license, indicate changes | attribution required |

## Deferred candidates
Not installed; recorded in `SKILL_CATALOG.md`. If installed later, add their notices here first. Note: vercel-labs/agent-skills has no LICENSE file in its repository despite an MIT claim in one skill's frontmatter; do not install from it until the team accepts that risk.
