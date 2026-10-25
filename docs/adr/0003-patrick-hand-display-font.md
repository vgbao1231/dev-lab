# 0003. Patrick Hand as the display font instead of Balsamiq Sans

Status: Accepted
Date: 2026-10-18

## Context

`design-reference/` uses Balsamiq Sans weight 700 for display text. Balsamiq Sans has no `vietnamese` subset, while all the content is written in Vietnamese.

## Decision

Use Patrick Hand (which has a Vietnamese subset) for display text, Inter for body content, and JetBrains Mono for metadata and code. This is a deliberate difference from the reference.

## Consequences

- Patrick Hand only has weight 400: headings use normal weight, with no faux bold.
- Inter currently only loads weights 400 and 500, so post titles use the display font instead of Inter 600 as in the reference.
- Chips in the facts table also use the display font (a deliberate exception, see `docs/design/typography.md`).
- Every font needs a fallback and must be checked for full Vietnamese diacritics before being locked in.
