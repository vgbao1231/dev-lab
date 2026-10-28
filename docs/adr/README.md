# Architecture Decision Records (ADR)

Each file records **one** decision: the context, the decision, and the trade-offs. Use it to answer "why was it done this way" without digging through commit history.

Conventions:

- File name `NNNN-short-name.md`, numbered in ascending order.
- Do not rewrite the decision or rationale of an old ADR. If a decision changes, add a new ADR and write "Supersedes ADR NNNN". Implementation drift may be recorded by appending a dated `## Implementation note (YYYY-MM-DD)` section; the original decision stays unchanged.
- The spec (values, current rules) lives in `docs/design/`; ADRs keep only the rationale.

Template:

```md
# NNNN. Decision title

Status: Accepted | Superseded by NNNN
Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

## List

| ADR                                              | Decision                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| [0001](0001-astro-static-and-pnpm-workspace.md)  | Static Astro portal, independent labs in a pnpm workspace        |
| [0002](0002-theme-mode-independent-axes.md)      | Theme and mode are two independent axes                          |
| [0003](0003-patrick-hand-display-font.md)        | Patrick Hand as the display font instead of Balsamiq Sans        |
| [0004](0004-view-transition-navigation.md)       | Page navigation with View Transitions                            |
| [0005](0005-mono-2px-smaller-than-inter.md)      | Mono text is always 2px smaller than Inter text in the same role |
| [0006](0006-sticky-capsule-header.md)            | Sticky capsule header with a translucent background              |
| [0007](0007-reading-progress-scroll-timeline.md) | Reading progress bar driven by `animation-timeline: scroll()`    |
| [0008](0008-one-pages-project-per-lab.md)        | Each lab is its own Cloudflare Pages project                     |
| [0009](0009-manual-post-covers.md)               | Post covers are assigned manually, inline SVG per theme          |
| [0010](0010-shared-tag-package.md)               | Shared tags through the `@dev-lab/tags` package                  |
| [0011](0011-search-command-palette.md)           | Search command palette, index generated at build time            |
| [0012](0012-home-layout-and-parallax.md)         | Home page layout and background parallax effect                  |
