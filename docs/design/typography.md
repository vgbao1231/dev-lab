# Design: Typography

> Part of the design system; index and routing table in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Section numbers stay as in the original because comments in the code point to "mục N".

## 4. Typography

| Role      | Font           | Used for                                                                                        |
| --------- | -------------- | ----------------------------------------------------------------------------------------------- |
| Display   | Patrick Hand   | Main headings, chips in the facts table. Use sparingly                                          |
| Handwrite | Caveat         | Hero name on the home page (up to 5.75rem / 92px), decorative handwritten notes ("Small steps") |
| Serif     | Lora           | Heading of the "Các lab" section and headings on lab cards                                      |
| Body      | Inter / Sans   | Post content, paragraphs, UI (the home page also supports `Be Vietnam Pro`)                     |
| Mono      | JetBrains Mono | Metadata, dates, tags, code blocks, standalone data tables (not yet implemented), facts labels  |

> **Home-page exception (ADR 0012):** the hero name and note use Caveat, the Labs sidebar heading uses
> Lora, and the lab card title uses Lora `--text-sm`. These keep their own role tokens below
> (`--text-hero`, `--text-note`, `--text-h2-home`) rather than borrowing from the body scale; every
> size is still a token, never a literal.

### Rules

- Do not use Patrick Hand for long paragraphs or long-form reading. One deliberate exception: **chips in the
  facts table** (`Frontend Engineer`, `Cà phê`) — each chip is only a word or two, and the handwriting keeps the
  chip row from looking as dry as a data table.
- **Mono text never uses the same size as the Inter text next to it.** JetBrains Mono has wide strokes and a
  high x-height, so at the same size it looks heavier than Inter. Three mono tiers:
  - **Mono labels** (eyebrow, table-of-contents heading): `--text-sm` (16px) — labels are spaced uppercase text
    and need to be large enough to read as labels.
  - **Mono text/links** (nav, footer links, kicker, link row, code blocks, meta lines, facts table labels):
    `--text-xs` (14px).
  - **Mono metadata** (tags, stack, theme selector labels, small notes): `--text-2xs` (12px).
  - **Facts table labels are the exception**: drop to `--text-xs` and use **lowercase**. Here the
    label annotates a value rather than naming an area, and five `uppercase` lines in a row read
    like shouting.
- **Every text link uses mono** for consistency (see `Link row` in section 6, `components.md`). Three deliberate exceptions:
  links that are **headings** (post titles, lab names, project names) keep the display font; links **inside
  sentences** (`.post-body`) keep the body font — switching fonts mid-line breaks the reading rhythm; and the
  **`DevLab.` brand** in the header keeps the display font (see `layout.md`).
- Patrick Hand has only one weight (400), so headings use normal weight; do not fake bold.
- Every font has a fallback: `system-ui, sans-serif` for Inter, `ui-monospace, monospace` for JetBrains Mono.
- Verify that full Vietnamese diacritics (ă, â, đ, ơ, ư and tone marks) render on each font before committing.
  Balsamiq Sans has **no** `vietnamese` subset (it was dropped); Patrick Hand does.

### Type scale

| Token              | Size                                    | Used for                                                                                                                                                                                                      |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--text-2xs`       | 0.75rem (12px)                          | Small mono text: post metadata, tags, stack, theme selector labels, small notes                                                                                                                               |
| `--text-xs`        | 0.875rem (14px)                         | **Mono text/links**: nav, footer links, kicker, link row, code blocks, meta lines, facts table labels                                                                                                         |
| `--text-sm`        | 1rem (16px)                             | Inter text (card/project descriptions, post summaries, TOC links, secondary paragraph in the Dev Lab block, footer description line, in-post tables) **and** mono labels (eyebrow, table-of-contents heading) |
| `--text-base`      | 1.0625rem (17px)                        | Body copy, secondary paragraph in the hero, hero slogan line (`.lead`), chips in the facts table (display font)                                                                                               |
| `--text-lg`        | 1.3125rem (21px)                        | `h3` in posts, post titles in lists, lab/project names on cards, brand name in the footer                                                                                                                     |
| `--text-xl`        | 1.625rem (26px)                         | Section headings                                                                                                                                                                                              |
| `--text-2xl`       | 2.375rem (38px)                         | Hero and `h1`, including the post title on the detail page                                                                                                                                                    |
| `--text-display`   | 3rem (48px)                             | Reserved, currently unused                                                                                                                                                                                    |
| `--text-brand`     | 1.75rem (28px)                          | The `DevLab.` brand in the header — display text standing alone, so it needs to be larger than UI text; comes with `line-height: 1` (section 5, `layout.md`)                                                  |
| `--text-hero`      | `clamp(3.5rem, 8vw, 5.75rem)` (56–92px) | Hero name on the home page (Caveat, `--font-caveat`)                                                                                                                                                          |
| `--text-note`      | 1.375rem (22px)                         | Handwritten note in the hero visual ("Small steps / Big progress", Caveat)                                                                                                                                    |
| `--text-h2-home`   | 1.75rem (28px)                          | "Các lab" sidebar heading on the home page (Lora)                                                                                                                                                             |
| `--text-h1-mobile` | 1.875rem (30px)                         | `h1` below 560px, one step down from `--text-2xl`                                                                                                                                                             |

Reasoning and revision history: [ADR 0005](../adr/0005-mono-2px-smaller-than-inter.md) and
[`CHANGELOG.md`](../CHANGELOG.md). When changing the scale, re-check three fragile spots: whether the header nav
still fits on one row at 1024px, whether long titles in the 220px TOC column wrap badly, and whether the header
height changes with the brand size.
