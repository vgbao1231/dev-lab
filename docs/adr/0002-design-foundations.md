# 0002. Design foundations: theme × mode, typography, tokens

Status: Accepted
Date: 2026-10-18 (merged 2026-11-04)

## Context

The design started from `design-reference/`, which uses four fixed theme/mode buttons and Balsamiq Sans
for display text. All content is Vietnamese and Balsamiq Sans has no `vietnamese` subset. Colours, fonts
and sizes must stay consistent between one theme's light and dark modes, and adding a theme must not
multiply combinations. The type scale also went through several tuning rounds because JetBrains Mono at
the same size as Inter looks heavier.

## Decision

- **Two independent axes:** `data-theme` and `data-mode` on `<html>`. Mode is "Hệ thống", "Sáng", "Tối";
  each theme defines its own light and dark palettes. Layout and typography do not change with the theme.
- Only Minimalist Editorial ships in phase 1. The theme picker hides itself when only one theme exists.
- **Fonts:** Patrick Hand for display, Inter for body, JetBrains Mono for metadata and code. Every font
  needs a fallback and a Vietnamese subset check before it is locked in. Patrick Hand has one weight, so
  headings never use faux bold.
- **Mono rule:** mono text is always 2px smaller than Inter text in the same role — 16px labels, 14px
  text and links, 12px metadata. Text links use mono; links that are headings keep the display font,
  links inside sentences keep the body font.
- **Tokens:** colour, font, type size, duration and easing come from `portal/src/styles/tokens.css`.
  Docs first, then the token, then the component.

## Consequences

- Adding a theme takes three steps: the palette in `docs/design/theme.md`, the CSS block in `tokens.css`,
  and registration in `portal/src/data/themes.ts`.
- The picker differs from the reference (mode is an icon button with a dropdown, theme is a native
  `<select>`); the difference is recorded in `DESIGN_SYSTEM.md`.
- View Transitions replace every `<html>` attribute, so `data-theme` / `data-mode` must be copied to the
  new document in `astro:before-swap`.
- When changing the type scale, re-check the header nav at 1024px, long headings in the 220px TOC
  column, and whether the header height changes with the brand size.
- Documented exceptions (facts-table chips, brand, heading links) live in `docs/design/typography.md`.
