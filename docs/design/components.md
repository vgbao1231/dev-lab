# Design: Components

> Part of the design system; index and routing table in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Section numbers stay as in the original because comments in the code point to "mục N".

## 6. Components (shared)

Two kinds of section headings:

- **Main heading** (`h2`, display font, `--text-xl`): used for the most important section — currently
  "Dev Lab". The home-page Labs sidebar is the intentional exception from [ADR 0012](../adr/0012-home-layout-and-parallax.md):
  `h2` in Lora `1.75rem`.
- **Section label (eyebrow)**: JetBrains Mono, `--text-sm`, `uppercase`, `letter-spacing: 0.08em`,
  color `--color-text-muted`. Used for the remaining sections (`Bài viết mới`, `Dự án khác`,
  `Liên hệ`).

### Lab card

- When a lab has an address, **the whole card is clickable**: the card is an `<article>`, the link in the title is
  stretched over the whole card with `::after`, so it shows a pointer cursor. When there is no address, the card is a static block:
  no hover, no pointer cursor.
- Background `--color-surface`, border `1px solid var(--color-border)`, 12px radius, 10px padding,
  10px gap, no shadow.
- Layout (top to bottom):
  - 72px cover area with 8px radius; its background comes from `coverBg` in `src/data/labs.ts`.
  - Category chip: `0.6875rem`, `rgba(125, 154, 114, .16)` background, `#bcd1ad` text.
  - Lab name (`h3`) in Lora `var(--text-sm)`, weight 500, `#efe9d6`.
  - Summary in `0.78125rem`, `#9a978a`, weight 300.
  - Meta line in `var(--text-2xs)` with a calendar icon and the status label.
- **Hover** (only when it is a link): border changes to `rgba(157, 187, 144, .42)`, card lifts
  `translateY(-3px)`.
- The literal colours and sizes in this section are existing known deviations from the token rule;
  see "Known deviations" in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md). Do not copy them to new components.

### Lab status

- A **text label** (`Đang chạy`, `Sắp tới`, `Dự kiến`) next to a 14px calendar icon, in the card's meta line.
- Status is never distinguished by colour alone.

### Tag

- JetBrains Mono, `--text-2xs`, color `--color-text-muted`, border `1px solid --color-border`, radius
  `--radius-sm`, padding `0.05rem 0.4rem`, no background color.
- Declared **once in `global.css`**; used for post tags, the stack in lab cards and the skills list in the
  "Về mình" section.
- Post tags come from the shared **`@dev-lab/tags`** registry (`packages/tags`), not free-form strings. Frontmatter
  stores the id (`react`, `state-management`); the schema validates, sorts by
  Technology → Domain → Approach, then converts to canonical labels (`React`, `State Management`) before the
  component reads them. Each post has **1–4 tags**, 2–3 recommended. Catalogue and tag-adding rules: [`docs/TAGS.md`](../TAGS.md).
- Tags are metadata independent of `lab`, `type` and category. Do not use tags to replace the lab name or post
  type; do not add a new tag if the registry already has one with the same meaning.

### Icon

- Shared icon set in `portal/src/components/Icon.astro`: viewBox 24, `1.5px` stroke, round caps,
  `currentColor`; solid icons (GitHub) use `fill`. Sizes in use: 14px in metadata, 16–18px
  in buttons/search field, 20px in page headings, 24px in the brand.
- Current catalogue: `leaf`, `search`, `sun`, `moon`, `monitor`, `flask`, `file-text`, `calendar`,
  `clock`, `github`, `x`, `enter`, `arrow-up`, `arrow-down`.
- Do not use emoji as functional icons (emoji in prose is fine). No shadows, no background fill
  for icons, except the 40×40px icon box in page headings: background `color-mix(in oklab, accent 14%, transparent)`,
  color `--color-accent`, radius `--radius-lg`.
- Icons that are purely decorative get `aria-hidden` (the component default); only pass `label` when the icon
  stands alone and needs to be read.

### Project list

- Row structure like the `Post list`: each project is one row, 16px vertical padding. A `1px --color-border`
  rule appears only **between consecutive rows** — there is no rule above the first row (it would read as an
  underline under the section heading) and none below the last (the section rule closes the list).
- Inside a row: project name (display font, `--text-lg`) and stack (mono `--text-2xs`, muted) at opposite ends
  of a baseline `flex` row; a one-sentence description (`--text-sm`, muted) on the line below.
- The name **is only a link when there is an `href`**; without a public version, leave it as plain text and do not create a dead link.

### Portfolio data sources

- `portal/src/data/profile.ts` is the single source for the name, the hero slogan line (`tagline`), the
  note-style motto (`slogan`), role, location, email, contact links, skills, intro paragraph and
  project list. The hero, the Dev Lab block (role kicker), the "Về mình" section, the footer and the contact page all read from
  here — edit one place, all five places update.
- Any empty field is **skipped** by the UI: `profileFacts` filters out empty rows in advance, `profileLinks` only adds
  `mailto:` when there is an `email`, the "Về mình" and "Dự án khác" sections on the home page are hidden entirely when there is no
  data, and when `tagline`/`slogan` are empty the hero drops that line.
- **Only declare what may be shown publicly.** Current state (2026-10-19): name, role,
  location, email, GitHub — approved; LinkedIn, CV, avatar — not yet.

### Facts table

- Used in the "Về mình" section (home page) and on the contact page. Each row: a mono **label** at `--text-xs` in muted color
  in a fixed left column (`flex: 0 0 7rem`, so labels line up across rows), and the **value** is a **chip**
  row on the right. Rows are 12px apart (grid `gap` on `.facts`), with **no row dividers**:
  chips already form blocks, and the page already has plenty of horizontal rules.
- **Chip** (`.facts__chip`): background `--color-surface`, border `1px --color-border`, radius `--radius-lg`, text in the
  **display font** (Patrick Hand) at `--text-base` in `--color-text`. Do not add a new color token — the
  `surface`/`border` pair already follows both theme and mode. Text uses `--color-text` and **not** accent:
  a whole chip row in accent would compete for emphasis with the kicker and the TOC.
- Chips share the token pair with `.tag` but play a different role: `.tag` is a technical label (mono 12px, radius
  `--radius-sm`), a facts chip is a value for the reader (display font 17px, radius `--radius-lg`).
- `align-items: baseline` on the row: the mono label and the text inside chips have different ascents, so aligning on the text
  baseline is what makes them line up; when the chip row wraps, the label stays on the first line.
- **One idea per chip.** `Ngoại ngữ` is two chips (`Tiếng Việt` / `Tiếng Anh · TOEIC 940`), `Ngoài code`
  is four chips. Merging a whole sentence into one chip goes back to the old line-of-text style.
- **Below 560px:** the label moves above, the chip row goes below and aligns left — long chips like `Tiếng Anh · TOEIC
940` need the full width so they are not broken mid-chip.
- `profileFacts` is built from `profile.location` (**Khu vực**) plus `profile.facts`; any row with no
  chips is filtered out, so empty fields do not leave an empty label.
- **Role is not in the facts table.** It already appears in the Dev Lab kicker; repeating it here is redundant.
- **Which rows to choose:** facts are for things that are **nearly constant** (`Ngoại ngữ`, `Nhiên liệu`,
  `Ngoài code`…). Things that change over time (where you work, what you are learning) do **not** belong
  here — they would need constant updating and would turn the facts table into a CV. To tell those, write them in `about`.
- **Wording:** capitalize the first word of each chip (`Cà phê`, `Đồ ngọt`, `Gura`, not `cà phê, đồ
ngọt và gura`). This is text for readers, not a place to paste raw notes back in.

### Post list (home page)

- Each post is **a single block link** (`display: block`), 16px vertical padding, with a rule only between
  consecutive rows; the section rule closes the list.
- Order: metadata (mono `--text-2xs`, muted) → title (display font, `--text-lg`) → summary (muted,
  `--text-sm`).
- **Hover:** the title changes to `--color-link`.
- The "Bài viết mới" section on the home page **keeps** this structure: no thumbnail, no reading time,
  no icon, no layout change. Cover cards are only used on `/bai-viet`.

### Post cover

- Each post has a **16:9** cover, set by hand in frontmatter with two fields:
  - `cover`: a key in `portal/src/data/covers.ts` (for example `react-fiber`).
  - `coverAlt`: the image description for screen readers; **required** when there is a `cover`.
- The SVG file lives in `portal/src/assets/covers/` and is embedded **inline** via `import.meta.glob(... ?raw)`
  so it can use the theme's color tokens. That way the cover switches light/dark by itself, with no need for two image
  sets and no dependency on an image optimization service.
- Cover colors use tokens only: `--color-surface`, `--color-bg`, `--color-text`,
  `--color-text-muted`, `--color-accent`, `--color-link`, `--color-border`. Do not hard-code colors.
- Posts without a cover use a monogram fallback: `--color-bg` background with a very light accent tint, the title's first letter
  in the display font in `--color-accent`, and a muted mono post-type label. The fallback must not create a link
  or a fake alt.

### Post card on `/bai-viet`

- Card grid: **1 column** by default, **2 columns** from 768px, **3 columns** from 1024px; gap 16px (20px from 1024px).
- Card: background `--color-surface`, border `1px --color-border`, radius `--radius-lg`, `overflow: hidden`, no
  shadow. The cover sits on top, with a rule below it.
- Card body: `type · lab` metadata (mono `--text-2xs`, muted) → title in display font `--text-lg`
  → summary in Inter `--text-sm` muted → tag row → bottom row with date and reading time (mono
  `--text-2xs`, 14px icons).
- **The whole card is the click target** of the title link via an `::after` overlay covering the whole card, but the
  accessibility tree contains only **one** link (the title link). Do not wrap an `<a>` around the whole card.
- **Hover** (pointer devices only): border tinted 55% accent, card lifts 2px, title changes to
  `--color-link`. Respects `prefers-reduced-motion`.
- The card title uses `view-transition-name: vt-post-<id>`, matching the `h1` on the detail page.
- **Reading time** only appears on `/bai-viet` cards: counted from the Markdown body, 200 words/minute, minimum 1
  minute (`src/lib/reading.ts`). Not added to the home list.

### In-post tables

- Markdown tables already have base styles in `portal/src/pages/bai-viet/[...slug].astro`:
  `border-collapse`, `1px --color-border` borders, Inter text at `--text-sm`, header cells in
  `--color-text-muted`, row hover changes the background to `--color-bg`.
- There is no separate "data table" yet (`--color-surface` frame, mono font). When needed, agree on a new spec instead
  of treating the bullets below as current:
  - Wrapped in a `--color-surface` frame, 1px border, radius `--radius-lg`, `overflow-x: auto`.
  - JetBrains Mono 12px. Column header cells in `--color-text-muted`, weight 400, **left-aligned**.
  - Data cells in `--color-text-muted`; the **first column** in `--color-text`, weight 500.
  - Rows separated by a thin rule; **row hover** changes the background to `--color-bg`.

### Link

- Color `--color-link`, **no underline** by default; the underline appears on hover (motion in
  section 7.4, `motion.md`).
- Nav links: color `--color-text-muted`; hover changes to `--color-accent` **and** shows a translucent accent pill
  background expanding behind the text (`color-mix(in oklab, accent 16%, transparent)`, `scale(0.85)` → `1`,
  `opacity 0` → `1`); no underline.
- Nav and brand hover effects apply only inside `@media (hover: hover) and (pointer: fine)` so no
  state sticks on touch devices.
- Current page: `aria-current="page"`, color `--color-text`; nav links specifically use `--color-accent` and the pill background.

### Button

| Variant    | Background       | Border               | Text                 | Hover                                             |
| ---------- | ---------------- | -------------------- | -------------------- | ------------------------------------------------- |
| `ghost`    | transparent      | none                 | `--color-text-muted` | background `--color-surface`, text `--color-text` |
| `outlined` | transparent      | `1px --color-border` | `--color-text`       | border `--color-accent`                           |
| `filled`   | `--color-accent` | none                 | `--color-bg`         | background `color-mix(in oklab, accent 88%, bg)`  |

- No variant is used yet. `ghost`, `outlined`, `filled` are reserved for future CTAs and forms; when
  used, follow the table above.
- The "selected" state is expressed by the element's own semantics (`checked` on `<input>`,
  `value` on `<select>`), not by a detached `.active` class.
- Do not invent a darker accent color for `filled`; use `color-mix` so it tracks theme × mode.

### Theme / mode selector

- Two independent axes, each axis is a `<label>` wrapping a native `<select>`: mono label at `--text-2xs` and
  mono `<select>` at `--text-2xs`, background `--color-surface`, border `1px --color-border`, radius
  `--radius-md`; hover changes the border to `--color-accent`.
- Uses a native `<select>` to keep OS behavior and keyboard support rather than redrawing the arrow
  (redrawing would mean hard-coding colors in the component).
- The theme group hides itself when only one theme is available. The text label is hidden below 768px (the
  `<label>` remains for screen readers).
- The mode group contains `Hệ thống`, `Sáng`, `Tối`; the theme group lists themes from `src/data/themes.ts`.
- Before the mode `<select>` there is a 14px icon matching the preference: `monitor` (Hệ thống), `sun` (Sáng), `moon`
  (Tối). The icon is chosen by CSS based on `html[data-mode-preference]`, no separate JS needed; the icon is decorative
  so `aria-hidden`.

### Search

- **Open button** sits in the header, next to the mode selector:
  - ≥768px: 34px-tall pill, background `color-mix(surface 70%, transparent)`, border `--color-border`, 16px search
    icon, text `Tìm kiếm…`, `kbd` showing `Ctrl K` (Mac: `⌘ K`). Hover changes border/text to
    `--color-accent`.
  - <768px: collapses into a 34px square icon button, transparent background/border; text and `kbd` hidden.
  - The button has `aria-haspopup="dialog"`, `aria-expanded` updated by JS.
- **Dialog** uses a native `<dialog>` + `showModal()` for the top layer, focus trap and Esc out of the box. Panel at most
  640px wide, background `--color-surface`, border `--color-border`, radius `--radius-lg`, soft shadow via
  `color-mix`. Backdrop tinted 62% `--color-bg` + 4px blur.
- **Content:** `type="search"` input (native clear button hidden), `x` close button, `role="listbox"` result list,
  each result `role="option"`; footer with key hints `↑` `↓` `↵` `esc` (hidden below
  640px).
- **Results** include posts, labs and static pages, up to 8 items. Each item has a type label (Bài viết /
  Lab / Trang), title and metadata. The selected item has a 12% accent background. No grouping by type, to keep
  keyboard navigation simple.
- **Keyboard:** `Ctrl/Cmd+K` or `/` (when not focused in an input/textarea/select/contenteditable)
  opens the dialog; `↑`/`↓` change item, `Enter` opens, `Esc` closes. Clicking outside the panel also closes it.
- **Accent-insensitive search:** NFD normalization, strip combining marks, map `đ` → `d`, lowercase; so `fiber`
  matches `Fiber`, `reconciliation` matches `Reconciliation`.
- **Index** generated at build time at `/search-index.json`; the client fetches lazily on first open and caches
  in memory. No runtime dependency added, no external API calls.
- **Not used** for a mobile menu; the mobile menu remains separate work (roadmap section 1.3).

### Back-to-top button

- Round button `--radius-pill`, 40×40px, fixed in the bottom-right corner (`--space-inline` from the edge), background
  `--color-surface`, border `1px --color-border`, color `--color-text-muted`; hover changes text and border
  to `--color-accent`.
- Hidden at the top of the page; only appears after scrolling past 600px. Fades in with `animation` (opacity +
  `translateY(4px)`), hides immediately via the `hidden` attribute so it can no longer receive focus.
- Clicking smooth-scrolls to the top; with `prefers-reduced-motion: reduce` it jumps straight there.

### Code block

- Background `--color-surface`, JetBrains Mono font, radius `--radius-sm`, `overflow-x: auto`.

### Link row

- A single inline link row, mono at `--text-xs` (14px) for **site-wide consistency**: nav, footer, the contact block,
  hero CTAs, the "Tất cả bài viết" line, the back link at the end of posts, and `skip-link` all use mono.
- Inline link rows share the `.link-row` class in `global.css`. Nav, footer and `skip-link`
  have their own layout, so they declare mono in the component without `.link-row`.
- The contact list comes from `profileLinks` in `data/profile.ts`, so **only existing links are shown** — no empty
  slot for a link that does not exist.
- Two deliberate exceptions (see section 4, `typography.md`): links that are **headings** keep the display font, links **inside
  sentences** keep the body font.
