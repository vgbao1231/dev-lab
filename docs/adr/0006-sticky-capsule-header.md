# 0006. Sticky capsule header with a translucent background

Status: Accepted
Date: 2026-10-18

## Context

The header was rebuilt in the style of `ngockhoi96.dev` (an addition beyond `design-reference/`): sticky, shrinking into a translucent capsule on scroll, and hiding or showing based on scroll direction. The requirement is to stay smooth and not push the content below.

## Decision

- The opaque background sits on the bar; the header has no background of its own. Once scrolled past 4px, the background becomes semi-transparent and the bar becomes a capsule.
- `backdrop-filter: blur(12px)` is enabled **permanently**. Toggling it by scroll state forces the browser to recreate the compositing layer mid-way and causes jank.
- The bar height **does not** change between the two states, so there is no reflow.
- Once scrolled, the capsule drops by `--header-inset` (12px, from 640px) using `position: relative; top` (it only changes at paint), with an opaque background strip `.site-header::before` covering the gap.
- Hidden when scrolled past 320px, a 16px delta is required to change state, and there is a 250ms cooldown between two hides; fully disabled under `prefers-reduced-motion`.
- Brand size 28px (`--text-brand`) with `line-height: 1`.

Measurements in headless Chrome at 1280px: at 24px with `line-height: normal`, the brand's line box is 32px and determines the bar height (header 62px). At 28px with `line-height: 1`, the line box is 28px, so the tallest element becomes the nav and the header drops to 60.4px. 32px is the largest size that still keeps 62px, but the glyphs are then as large as `h1`.

## Implementation note (2026-10-29)

The 12px inset is kept, but `.site-header::before` is gone. The gap is transparent, so page content can
pass behind the floating capsule; the opaque strip used to show as an extra band over the home-page gradient
and was removed after visual review. The rest of the decision above still stands.

## Consequences

- Changing the brand size within 28–32px does not trigger any other changes.
- The header is the **only** exception to the "only animate `opacity` and `transform`" rule: it changes `max-width`, `padding-inline`, background colour, border, corner radius, and shadow. This exception must not be extended to other elements.
- The token `--duration-chrome` (340ms) is dedicated to this motion.
