# 0002. Theme and mode are two independent axes

Status: Accepted
Date: 2026-10-18

## Context

The interface was initially imagined as four fixed modes (two themes times two modes). That approach is hard to extend: each new theme brings a multiple of combinations. `design-reference/` also uses four combined buttons and drops the "Hệ thống" option.

## Decision

- Two independent attributes on `<html>`: `data-theme` and `data-mode`.
- Mode consists of "Hệ thống", "Sáng", "Tối". Each theme only defines the colour palettes for its own light and dark.
- Layout and typography do not change with the theme; only colours change.
- Phase 1 only ships Minimalist Editorial. The theme picker hides itself when there is only one theme.

## Consequences

- Adding a new theme takes three steps: the palette in `docs/design/theme.md`, the CSS variables block in `tokens.css`, and registration in `portal/src/data/themes.ts`.
- The picker uses two native `<select>` elements, unlike the reference; this difference is recorded at the end of `DESIGN_SYSTEM.md`.
- View Transitions replace all attributes of `<html>`, so `data-theme` / `data-mode` must be copied to the new document in `astro:before-swap` (see ADR 0004).

## Implementation note (2026-10-28)

The control changed after the decision was written: mode is now a single icon button that opens a dropdown
(`role="menu"` + `role="menuitemradio"`), while the theme axis keeps the native `<select>` and still hides itself
when only one theme exists. The two-axis decision is unchanged.
