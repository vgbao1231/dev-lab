# 0007. Reading progress bar driven by `animation-timeline: scroll()`

Status: Accepted
Date: 2026-10-18

## Context

The first version recorded progress with JS on every scroll frame, so the bar stuttered.

## Decision

- Primary path: when the browser supports `animation-timeline: scroll()`, the animation follows scroll progress on the compositor. JS only measures and writes `--reading-start` / `--reading-end` for `animation-range`, and does nothing per frame.
- Fallback path: when the browser does not support it, JS writes `--reading-progress` on every scroll frame.
- JS confirms with `getComputedStyle(bar).animationName`, rather than trusting `CSS.supports` alone: if the syntax is dropped somewhere but JS has already stopped writing, the bar would sit still at 0.
- No `transition`: the value already tracks every frame, so a transition would only add artificial lag.

## Consequences

- Under `prefers-reduced-motion: reduce`, the primary path is not enabled: the global rule `animation-duration: 0.01ms !important` in `global.css` would make the scroll-progress animation jump straight to 100%. JS takes over and the bar still runs.
- No percentage is displayed, only a thin 2px line.
