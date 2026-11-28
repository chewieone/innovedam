# UI Guidelines

Owner: Role B (Frontend). Applies to every interface in the product. Styling system: **Tailwind CSS** + **React Flow (`@xyflow/react`)** (decided 2026-11-28). Exact brand color hexes and custom display fonts remain `TODO - TEAM DECISION REQUIRED` unless finalized below.

## Colour palette
TODO - TEAM DECISION REQUIRED for final brand hex/oklch values. Structure using Tailwind semantic tokens mapped in `client/src/styles/tokens.css`:
- One primary action colour (for primary buttons, active nav, selected graph nodes).
- One neutral slate/zinc scale (8-10 steps) for surfaces, borders, and body text.
- Semantic status colours (never raw ad-hoc hexes in components), distinguishing **Decision Lifecycle**, **PS-02 Work Status**, and **Team Execution Progress** visually so "Approved" never looks like "Finished":
  - **Decision Approved (triggers R1-R4) / Work Open:** Emerald / Blue info badges
  - **Decision Draft (R1 non-triggering):** Neutral / Muted dashed badge
  - **Work Closed pass-through (R3 traversed, no owner notification):** Subdued grey/dashed node with explicit "Closed — traversed only" badge
  - **Confidential / R4 Redacted:** Warning/Lock amber-slate badge with explicit lock icon and safe action context panel
  - **Reversed (R5 withdrawn/review):** Rose/Danger review badge
  - **Team Execution Progress (`Not_Started` / `In_Progress` / `Blocked` / `Completed`):** Separate progress pill/bar shown alongside (never replacing) `Open`/`Closed` and `Approved`

## Typography
TODO - TEAM DECISION REQUIRED for final font family. Structure: one clean sans-serif UI font (plus monospace/tabular numerals `tabular-nums` for IDs like `W001`, `B025`, `P001`, timestamps, progress percentages, and ripple hop counts), with a clear scale (`display` / `title` / `body` / `caption`).

## Spacing
4px base grid matching Tailwind's default spacing scale (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-12` = 48px).

## Design tokens
Define tokens once as CSS variables in `client/src/styles/tokens.css` and expose them via Tailwind theme configuration. Never hardcode ad-hoc hex values in feature components.

## Component conventions
- Shared primitives (`Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `EmptyState`, `Navigation`) are built once by Role B before separate feature views and live in `client/src/components/ui/` (`Button`, `Badge`, `Card` scaffolded in M1).
- One component per visual concept; variants through props, not copy-paste.
- Interactive states are mandatory: hover, pressed, focus-visible, disabled, loading, empty (important for teams/employees with zero work items, e.g., `Design`, or HR seats with zero assigned teams yet).

## Buttons
Primary (one per view), secondary, destructive (e.g., Reverse decision / Reject onboarding request). Labels are verbs (`Approve Request`, `Approve Decision`, `Reverse Decision`, `Update Progress`, `Assign HR Teams`, `Import Workbook`). Loading state replaces label with spinner and disables repeat submits.

## Forms
Labels always visible (no placeholder-only labels). Errors inline per field plus a summary banner on submit failure. Validation messages consume `API_CONTRACT.md` `{ error: { code, message, details } }` shape.

## Cards
Consistent radius, padding and elevation from tokens. Nested surfaces follow the outer-radius = inner-radius + padding rule (see the `better-ui` skill).

## Navigation
Persistent app shell across authenticated views:
- **Approved Member Views:** `My Workspace` (My Team + My Work with Team Lead progress controls + My Decisions), `PS-02 Ripple Solver` (Decisions list & full React Flow ripple graph), `Org Directory`.
- **HR Role Seat View (assignment-gated):** `HR Assigned Teams` (tracks decision follow-through & Team Lead execution progress strictly across explicitly assigned teams; shows original decision author and successor-inherited tracking while obeying R4 redaction).
- **Manager / Admin Views (role-gated):** `Onboarding Queue` (MyGate pending approvals).
- **Admin Views:** `Role & HR Assignments` (assign HR teams & perform successor handoffs), `Workbook Import` (`.xlsx` upload & schema validation summary).
- **Pending Member View:** Dedicated `Pending Approval` status screen showing requested team/manager and blocking workspace access until approved.
- Active route state is always clearly visible; header displays current user, team, role seat (if assigned), and `Internal` vs `Confidential` clearance badge.

## Responsive design
- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- Touch targets at least 44px. Hover-only affordances are never the only way to inspect a ripple node (click/tap opens detail drawer).

## Accessibility
- Contrast: 4.5:1 text, 3:1 non-text boundaries (including React Flow node borders and status badges).
- Keyboard: every interaction reachable, visible focus ring, sensible tab order, keyboard-accessible graph node list fallback beside the React Flow canvas.
- ARIA only where native semantics are insufficient. Respect `prefers-reduced-motion`.

## Animation conventions
Follow the `animate` and `better-ui` skills: transform/opacity only, ease-out for entrances, subtle highlight for ripple wave propagation, everything gated behind `prefers-reduced-motion`. Functional correctness of R1-R5 outranks polish.
