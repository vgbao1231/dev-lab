# 0004. Page navigation with View Transitions

Status: Accepted
Date: 2026-10-18

## Context

We want smooth page navigation while keeping the site static and without adding a framework. Motion must stay minimal, and should clarify state changes and hierarchy rather than decorate.

## Decision

- Use Astro's `<ClientRouter />`. Only `main` cross-fades; the root element does not animate.
- The header uses `transition:persist`; page titles have `view-transition-name: page-title`; post titles are the shared element `vt-post-<id>`.
- Theme/mode changes are wrapped in `document.startViewTransition()`, with a `data-theme-transition` flag so that this change still cross-fades the whole page.
- Entrance animation for `[data-animate]` uses `motion/mini`, and only runs on the first page load.

## Consequences

- `aria-current` in the nav must be updated by JS because the header DOM is preserved.
- `data-theme` / `data-mode` must be copied in `astro:before-swap`, otherwise the theme is reset after navigation.
- The `.motion-ready` flag is inserted by an inline script before paint and only when reduced motion is not requested, so there is no flash and content is not hidden when JS fails.
- Only `opacity` and `transform` are animated; the only exception is the header chrome (see ADR 0006).
