# UI Guidelines

Owner: Member 2. Applies to every interface in the product. Design tokens below are starting defaults: TODO - TEAM DECISION REQUIRED in Phase 5 once the product and brand are known.

## Colour palette
TODO - TEAM DECISION REQUIRED. Structure: one primary action colour, one neutral scale (8-10 steps), semantic colours for success / warning / danger / info, dark-mode variants. Record exact hex/oklch values here, never ad-hoc values in components.

## Typography
TODO - TEAM DECISION REQUIRED. Structure: one UI font family, a scale (display / title / body / caption), line heights per step, tabular numbers for data.

## Spacing
4px base grid. All margins, padding and gaps are multiples of 4 (4, 8, 12, 16, 24, 32, 48). TODO - confirm with chosen styling system.

## Design tokens
Define tokens once (CSS variables or the styling system's theme) and consume tokens, never raw values. TODO - token file location after stack selection.

## Component conventions
- Shared primitives (Button, Input, Card, Modal, Navigation) are built once by Member 2 before separate pages (Phase 5) and live in the shared components folder: TODO - path after stack selection.
- One component per visual concept; variants through props, not copy-paste.
- Interactive states are mandatory: hover, pressed, focus-visible, disabled, loading, empty.

## Buttons
Primary (one per view), secondary, destructive. Labels are verbs. Loading state replaces label with spinner and disables repeat submits.

## Forms
Labels always visible (no placeholder-only labels). Errors inline per field plus a summary on submit failure. Validation messages follow `API_CONTRACT.md` error shape.

## Cards
Consistent radius, padding and elevation from tokens. Nested surfaces follow the outer-radius = inner-radius + padding rule (see the better-ui skill).

## Navigation
TODO - navigation pattern in Phase 5. Keep it identical across pages; active state is always visible.

## Responsive design
- Mobile-first breakpoints: TODO - confirm values with styling system.
- Touch targets at least 44px. Hover-only affordances are never the only way to act.

## Accessibility
- Contrast: 4.5:1 text, 3:1 non-text boundaries.
- Keyboard: every interaction reachable, visible focus ring, sensible tab order.
- ARIA only where native semantics are insufficient. Respect `prefers-reduced-motion`.

## Animation conventions
Follow the animate and better-ui skills: transform/opacity only, ease-out for entrances, staggered entrances only for infrequent moments, everything gated behind reduced-motion. Functional correctness outranks polish.
