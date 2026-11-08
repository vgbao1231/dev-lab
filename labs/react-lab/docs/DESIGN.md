# React Lab — design contract

React Lab is a **hybrid** of Dev Lab (the portal) and Motion Lab:

- the portal supplies the reading experience: warm neutral ground, long-form articles, real URLs,
  metadata, covers and a calm typographic rhythm;
- Motion Lab supplies the demo experience: a framed stage, a live result next to the code, and
  explicit reduced-motion handling.

It is not a copy of either. The lab keeps its own cyan accent and its own `--lab-*` tokens, so it reads
as a sibling without pretending to be the blog or Motion Lab.

## Tokens

`src/styles/tokens.css` is the only source for colour, type and spacing. Base values mirror the
portal's warm ground; the accent is cyan/teal so the three sites stay distinguishable.

| Token                 | Light     | Dark      | Use                            |
| --------------------- | --------- | --------- | ------------------------------ |
| `--lab-bg`            | `#f7f4ed` | `#171614` | page ground                    |
| `--lab-surface`       | `#fffcf6` | `#24221f` | cards, header, panels          |
| `--lab-surface-muted` | `#f0ece2` | `#2c2a26` | covers, table headers, stage   |
| `--lab-text`          | `#292720` | `#f2ebdd` | body and headings              |
| `--lab-text-muted`    | `#756f64` | `#b6ada0` | metadata, summaries, captions  |
| `--lab-border`        | `#e3ddd1` | `#3a3630` | hairlines and card borders     |
| `--lab-accent`        | `#0b6e8a` | `#7dd3fc` | links, tags, brand mark, focus |
| `--lab-accent-soft`   | `#e2f1f6` | `#10303c` | tag and inline-code background |

Mode lives on `<html data-mode="light|dark">`. The inline script in `BaseLayout` resolves the stored
preference before paint; `ThemeToggle` flips and stores it. `prefers-color-scheme` is the default until
the reader chooses. There is no second theme.

Type: **Be Vietnam Pro** for display and UI, **Inter** for body copy, **JetBrains Mono** for metadata,
tags and code. Colour and type values must come from tokens; no literal colours in components.

## Layout

- `--lab-width-page: 1120px` — header, footer, home and index.
- `--lab-width-content: 760px` — article body and article header.
- Gutters: 20px, 24px from 768px, 32px from 1024px.
- One column by default; post cards go two-up at 720px and three-up at 1024px.

The header is sticky with a translucent ground and a 1px border, brand on the left, mono nav and the
theme toggle on the right. Below 640px the portal link is hidden and the brand shrinks, so the row
never wraps.

## Surfaces

### Home

1. Hero: kicker, one-sentence promise, two actions (knowledge, portal).
2. **Bài mới**: the three newest articles as cards.
3. **Học theo chủ đề**: six topic cards linking to the anchors on `/kien-thuc`.

The hero is text-only. No gradients, glows or decorative marks beyond the 12px accent square in the
brand.

### Article index (`/kien-thuc`)

Grouped by topic in the fixed order from `src/data/content.ts`; empty topics are omitted. Each group
has a title, a one-line description and a card grid. Anchors (`#hooks`, `#rendering`, …) are stable so
the home topic cards and article footers can link to them.

### Article page

Breadcrumb → type/topic/level → `<h1>` → summary → date + reading time → tags → 16:9 cover →
prose → footer with "all knowledge" and "more in this topic". The prose measure is 760px.

Prose rules: body 17px/1.75, `h2` 1.5rem, `h3` 1.25rem, code blocks scroll horizontally rather than
breaking layout, inline code uses `--lab-accent-soft`, tables have token borders. A cover is optional;
without one the monogram fallback keeps the card and article aligned.

### Demos (planned)

Demos will use a framed stage above the explanation, with the interaction and the live result in the
same view. Motion Lab's stage grammar is the reference, not the markup: border-led frame, mono bar,
result area, controls. Motion follows the same rule: animate only when the OS allows it, and never make
movement the only carrier of information.

## Content model

An article needs `title`, `date`, `type`, `topic`, `level`, `tags`, `summary`; `cover` + `coverAlt` are
optional but paired. `draft: true` removes it from lists and the build.

- `topic` is the curriculum branch: `hooks`, `lifecycle`, `rendering`, `state`, `performance`,
  `libraries`. A new topic updates the schema, labels, home grid and this document.
- `level` is `co-ban`, `trung-cap` or `nang-cao`. It is a reading expectation, not a quality badge.
- Tags come from `@dev-lab/tags`; do not invent ids in the lab.

## Accessibility

- `:focus-visible` is a 2px accent outline with 3px offset, never removed.
- The skip link is the first focusable element; the header and footer are landmarks.
- Light and dark both come from tokens; muted text is for metadata, never the only copy.
- Motion is limited to hover lifts and short transitions. Under `prefers-reduced-motion: reduce`,
  transitions are shortened and smooth scrolling is disabled. Demos must still communicate state.
- No hover-only information; cards are links, not click handlers.

## Adding things

- **New article:** add a file, fill the frontmatter, run the build. No route file needed.
- **New cover:** add the SVG under `src/assets/covers/`, add its id to `src/data/covers.ts`, and use
  token variables inside the SVG (`--lab-*`) so both modes work.
- **New topic:** update the schema enum, `topics` + labels + descriptions in `src/data/content.ts`,
  the home grid, and this document in the same change.
- **New demo:** follow Motion Lab's contract (meta, lazy component, preview kind, reduced-motion
  behaviour) and document it here before shipping.
