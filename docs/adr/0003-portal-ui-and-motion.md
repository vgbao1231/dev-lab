# 0003. Portal navigation, chrome and motion

Status: Accepted
Date: 2026-10-18 (merged 2026-11-04)

## Context

The portal is static and should stay smooth without a framework. Motion has to clarify state changes and
hierarchy, not decorate. Three areas drove this: page navigation, the sticky header, the reading progress
bar, and the home-page visual refresh. The header was rebuilt in the style of `ngockhoi96.dev`, an
addition beyond `design-reference/`. The first reading-progress version wrote on every scroll frame and
stuttered. The home refresh follows `design-reference/dev-lab/Main.dc.html` and needs blobs, dust
particles and pointer/scroll parallax.

## Decision

- **Navigation:** Astro's `<ClientRouter />`. Only `main` cross-fades; the root does not animate. The
  header uses `transition:persist`; post titles are a shared element named `vt-post-<id>`. Theme/mode
  changes are wrapped in `document.startViewTransition()` with a `data-theme-transition` flag so the
  whole page cross-fades. `[data-animate]` entrance runs through `motion/mini` and only on first load.
- **Header:** the opaque background sits on the bar, not the header; past 4px of scroll the bar becomes
  a translucent capsule. `backdrop-filter: blur(12px)` stays on permanently, because toggling it
  rebuilds the compositing layer and causes jank. The bar height does not change, so there is no reflow.
  The capsule drops 12px from 640px using `position: relative; top`. Hiding starts past 320px, needs a
  16px delta, keeps a 250ms cooldown, and is disabled under `prefers-reduced-motion`.
- **Reading progress:** a 2px line at the top edge with no percentage. Primary path uses
  `animation-timeline: scroll()` on the compositor; JS only writes `--reading-start` / `--reading-end`.
  The fallback writes `--reading-progress` per frame, and JS confirms support with
  `getComputedStyle(bar).animationName` rather than trusting `CSS.supports` alone. No `transition` on the
  bar.
- **Home page:** the background is painted on `<body>` while the home page is mounted, built from
  `--color-accent` mixed into `--color-bg`. Decoration sits in a layer behind `main` and the footer,
  is `aria-hidden`, is hidden in light mode, and is fully disabled under `prefers-reduced-motion`.
  Parallax runs in plain TypeScript with `requestAnimationFrame`, normalised coordinates and a slow CSS
  transform transition, and re-initialises on `astro:page-load`.

## Consequences

- `aria-current` in the nav must be updated by JS because the header DOM is preserved across navigations.
- `data-theme` / `data-mode` must be copied in `astro:before-swap` or the theme resets after a navigation.
- The `.motion-ready` flag is set by an inline script before paint, only when reduced motion is not
  requested, so there is no flash and content is never hidden when JS fails.
- Only `opacity` and `transform` are animated. The header chrome is the **only** exception (it changes
  `max-width`, `padding-inline`, colours, border, radius and shadow, all horizontal or paint-only) and
  `--duration-chrome` (340ms) belongs to it. Do not extend this exception.
- The home-page blobs and dust particles are the **only** accepted decorative exception: longer
  transitions (2.4–2.8s) and infinite keyframes, limited to the home page.
- Under `prefers-reduced-motion`, the compositor progress path is skipped because the global
  `animation-duration: 0.01ms !important` rule would jump the bar to 100%; JS takes over.
- Exact values, measurements and the current particle count live in `docs/design/layout.md`,
  `docs/design/motion.md`, and in the historical notes in `CHANGELOG.md`.
