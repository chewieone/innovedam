---
trigger: model_decision
description: UI consistency requirements when building or modifying any user interface.
---
# UI consistency

1. Follow UI_GUIDELINES.md: tokens, spacing grid, components, states.
2. Use shared primitives; do not fork Button/Input/Card per page.
3. Consume design tokens, never raw hex or pixel values, outside the token definitions.
4. Every interactive element has hover, pressed, focus-visible, disabled and loading states.
5. Accessibility: 4.5:1 text contrast, keyboard reachable, visible focus, reduced-motion respected.
6. Motion follows the animate and better-ui skills: transform/opacity, ease-out entrances, reduced-motion gating.
7. A polish finding never outranks a broken interaction.
