# 0005. Mono text is always 2px smaller than Inter text in the same role

Status: Accepted
Date: 2026-10-19

## Context

JetBrains Mono has wide strokes and a tall x-height, so at the same size as Inter it looks heavier. The type scale went through several rounds of tuning on the same day (details in `docs/CHANGELOG.md`), and there were times when the two fonts side by side looked mismatched in size.

## Decision

Mono text is always 2px smaller than Inter text in the same role, split into three tiers:

- Mono labels (eyebrow, table-of-contents heading): `--text-sm` (16px), uppercase with letter-spacing.
- Mono text and links (nav, footer links, kicker, link rows, code blocks, meta line): `--text-xs` (14px).
- Mono metadata (tags, stack, theme picker label): `--text-2xs` (12px).

Every text-style link uses mono; inline link rows are grouped under the `.link-row` class, while nav, footer, and `skip-link` have their own layout and therefore declare mono themselves. Three exceptions: links that are headings keep the display font, links inside sentences keep the body font (changing font mid-line breaks the reading rhythm), and the brand in the header keeps the display font. The facts table labels are also an exception: `--text-xs`, lowercase, because five uppercase rows in a row read like shouting.

## Consequences

- The `--text-md` token was removed because nothing uses it anymore; `.lead` uses `--text-base`.
- When changing the type scale, re-check: whether the header nav still fits on one row at 1024px, whether long headings in the 220px table-of-contents column wrap badly, and whether the header height changes with the brand size.
