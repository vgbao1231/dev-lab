# Design: Layout

> Part of the design system; index and routing table in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Section numbers stay as in the original because comments in the code point to "mục N".

## 5. Layout

- **Two width tiers.** `--width-page` (1120px) is the outer frame — header, sections, grids, tables.
  `--width-content` (800px) is the text block (`.measure`) so lines do not run too long; the reading column for
  posts (`.prose-col`) shares this value, and there is no third tier. Content inside the frame is
  **left**-aligned, so the text block and the grids always line up with each other.
- **Sections are separated by a thin rule** at the end of each section. The rule is drawn with `::after` and
  `inset-inline: var(--space-inline)`, so it only spans the content width (not bleeding into the horizontal
  padding) and lines up with the header capsule once scrolled. Section vertical padding is 48px on desktop,
  40px on mobile; the hero has 56px padding-top.
- **Horizontal padding** by breakpoint: 20px (default) → 24px (≥768px) → 32px (≥1024px).
- Generous whitespace, but do not inflate spacing between sections. No fixed sidebar.
- **Base breakpoints** (written directly into media queries because CSS does not allow variables in media
  conditions): 560px (one column), 640px (header on one row, nav centered), 768px (48px sections),
  1024px (32px horizontal padding).
- **Header:** sticky (`position: sticky`); the `DevLab.` brand in the display font (`--text-brand`) on the left, nav
  centered, the theme/mode selectors (two `<select>`s) and the search button on the right; a rule under the header.
  - The search button is a pill from 768px (icon + `Tìm kiếm…` + `kbd`), collapsing into a square icon button below
    768px. Dialog behavior is in `components.md`, the "Search" section.
  - The brand is `--text-brand` (28px) with `line-height: 1` pinned, so header height is decided by the nav (about
    60px) rather than by the brand size. Changing the brand size within 28–32px pulls no other change.
    Measurements and reasoning: [ADR 0006](../adr/0006-sticky-capsule-header.md).
  - The header has **no** background of its own; the opaque background is on the bar. That way, when scrolled,
    the area outside the capsule is transparent and no rectangle shows behind the four rounded corners.
  - Past 4px of scroll: the background becomes semi-transparent, the bar shrinks into a **capsule** and gains a
    very light shadow. `backdrop-filter: blur(12px)` is **always on** (toggling it with scroll state would
    rebuild the compositing layer mid-scroll and cause jank); in the initial state the background is opaque, so
    the blur is not visible.
  - The capsule is `calc(var(--width-page) - 2 * var(--space-inline))` wide and the header leaves
    `padding-inline: var(--space-inline)`, so on wide screens the capsule aligns exactly with the content edge,
    and on narrow screens it also touches that edge. The bar height does **not** change between the two
    states, so it does not push the content below.
  - Hide/show by scroll direction: only start hiding after scrolling past **320px**, require a **16px** delta
    to change state (prevents jitter on small scrolls), with a **250ms** cooldown between two consecutive hides,
    and scrolling up shows it again immediately. Fully disabled when `prefers-reduced-motion: reduce`.
  - When scrolled, the capsule is pushed down by `--header-inset` (12px, only from 640px) instead of sticking to
    the screen edge. The push uses `position: relative; top` — a property that **only changes on paint**, not
    layout, so the header keeps its height. That gap exposes content drifting behind it, so an opaque strip
    covers it via `.site-header::before` (`position: absolute`, out of flow): in the initial state the capsule
    covers this strip, so it is not visible.
  - The header uses `transition:persist`, so the DOM is kept across navigations — therefore `aria-current` must
    be updated by JS. The nav only has `labs`, `bài viết`, `liên hệ`; the brand links home, so there is **no**
    separate "Trang chủ" item.
- **Hero (greeting):** greeting line `Xin chào, tui là` → `h1` with the name from `profile.ts` → tagline
  (`profile.tagline`; omit when empty) → **motto** as a `// …` note in accent color (`profile.slogan`;
  omit when empty) → CTA link row (`Xem các lab`, `Đọc bài viết`, `Liên hệ`). This is a **greeting**, not
  an ecosystem description: the home page is a personal portfolio, so it opens with "who is writing",
  and the "what is this place" part belongs in the next section.
  - The tagline uses `--text-base` in muted color. The motto uses `--text-base` in `--color-accent`.
  - All **three** CTA links have an `→` arrow; the arrow is not a marker for the primary CTA but the shared
    style of the link row, so do not add it to one link and drop it from another.
  - **2-column layout:** left is text content (flex 1 1 420px), right is a visual column for the illustration (flex 1 1 280px).
    - Left column: small leaf icon + greeting line → `h1` name in the loose `Caveat` font (clamp up to `5.75rem`) → tagline → CTA link row.
    - Right column: decorative sprout SVG + "Small steps / Big progress" note in `Caveat` `1.375rem`,
      rotated -10deg. Both have a subtle floating parallax effect (`.hero-fx`). When narrow, the right column shrinks and stacks below the text.
  - The greeting line, name, tagline and motto currently use literal colours and sizes; they are known
    deviations from the token rule. See "Known deviations" in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
  - **Home decorative background & parallax:** wrap the whole page in `.home-wrapper` carrying the `#0b0d09` background color combined with a dark moss-green `radial-gradient` from the top.
    - Contains 6 large blobs and 62 blurry floating dust particles (`.home-deco`, `.home-dot`) that move with pointer parallax (`mousemove`) and page scroll (`scroll`) via `requestAnimationFrame` and smooth CSS transitions (2.4s - 2.8s), combined with keyframe bobbing and a natural glowing breath.
    - Automatically disabled when the user enables `prefers-reduced-motion: reduce`. Light mode hides the blobs/dots by itself and switches to a harmonious light gradient.
- **Dev Lab block** (the section right below the hero): mono kicker `~/devlab · <vai trò>` → `h2` in display font
  `Dev Lab` → ecosystem description paragraph → one comment-style note line (`// …`) in `--color-accent`
  in mono → secondary paragraph in `--color-text-muted` (`--text-sm`, not `.lead` — `.lead` is reserved
  for the hero slogan).
- **Lab grid:** 2-part layout inside `.section--labs`:
  - **Left sidebar** (flex 1 1 260px, max-width 330px): beaker icon colored `#9dbb90` → `h2` in `Lora` `1.75rem` "Các lab" (`#efe9d6`) → small
    description paragraph (`0.8125rem`, `#a29f92`) → "Xem tất cả các lab →" link `0.8125rem`, hover turns to `#b9d3aa`.
  - **Card grid on the right** (flex 3 1 480px): `repeat(auto-fit, minmax(min(200px, 100%), 1fr))`, gap 20px.
    When narrow, the sidebar stacks as one column above the card grid.
  - **Lab card** 12px radius, 10px padding, 10px gap, translucent surface background:
    - 72px cover image with 8px radius (color from `coverBg` in `labs.ts`)
    - Compact category chip (`0.6875rem` font, `rgba(125,154,114,.16)` background, `#bcd1ad` text)
    - Lab title in `Lora` `var(--text-sm)`, weight 500, color `#efe9d6`
    - Summary `0.78125rem` in `#9a978a`, weight 300
    - Date/status meta line `var(--text-2xs)` with a calendar icon
    - Hover lifts the card 3px (`translateY(-3px)`) and changes the border to `rgba(157,187,144,.42)`.
    - The literal colours and sizes in the lab card are existing known deviations; see
      "Known deviations" in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
- **Post grid on `/bai-viet`:** 1 column by default, 2 columns from 768px, 3 columns from 1024px; gap 16px
  (20px from 1024px). Each post is a card with a 16:9 cover; the home page still uses the row-style list and
  does not change with this grid.
- **Post detail page:** the layout is decided by `.post-layout`, `justify-content: center` so
  the whole column group is centered in the frame.
  - Below 1200px: **one column** — reading column (`.prose-col`, `--width-content` 800px), the TOC is a block at
    the top of the post.
  - From 1200px: **two columns** — 800px reading column + `--width-toc` (220px) TOC column, 40px apart;
    the TOC column sticks below the header so it is always visible.
  - Short text blocks on other pages also use `.measure` (800px) and align left to line up with the grid
    below. The reading progress bar is pinned to the top edge of the viewport (section 6, `post-page.md`).
- **Home section order:** hero (greeting) → Dev Lab → Về mình → Các lab → Bài viết mới →
  Dự án khác → Liên hệ. The current code renders Về mình before Dev Lab; this is a known deviation,
  not the intended order. See "Known deviations" in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
  The "Về mình" and "Dự án khác" sections **only appear when there is real data** in
  `portal/src/data/profile.ts`; when absent they are hidden entirely, with no empty block or "sẽ bổ sung" sentence left behind.
  The "So sánh giữa các stack" section was dropped on 2026-10-18 and will be built together with section 1.5 in `ROADMAP.md` once there are real
  measurements.
- **Footer:** four columns on the `--width-page` frame, stacked when narrow, then 2 columns from 640px and 4
  columns from 1024px (brand column `1.6fr` wide, three navigation columns `1fr`):
  1. **Brand** — display-font name + one description line (`--text-sm`, muted, max 34ch).
  2. **Content** — four internal routes (Trang chủ, Bài viết, Labs, Liên hệ).
  3. **Lab** — generated directly from `data/labs.ts`, not copied by hand.
  4. **Contact** — generated from `data/profile.ts` (GitHub, email if available) + `Trang liên hệ` link.

  Each column is a `<nav aria-labelledby>` pointing at the column's `.eyebrow` label. Footer links use
  `--color-text-muted`, only rising to `--color-link` on hover — four columns all in `--color-link` would be too loud.
  The bottom row is separated by a 1px `border-top`: `© [năm] [Tên] · Dev Lab` on the left, `Mã nguồn · Deploy trên
Cloudflare` on the right. Data sources: see section 6, "Portfolio data sources" in `components.md`.

- **Sticky footer:** `body` is a flex column at least `100dvh` tall, `main` stretches in the middle
  (`flex: 1`). When content is shorter than the viewport, the footer still sits at the bottom of the viewport
  instead of hovering right below the content. Uses `100dvh` rather than `100vh` so it is not clipped by the
  mobile address bar.

### Layout and shape tokens

| Token             | Value       | Used for                                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------- |
| `--width-page`    | 1120px      | outer frame: header, sections, grids, tables                                 |
| `--width-content` | 800px       | short text block (`.measure`) and post reading column (`.prose-col`)         |
| `--width-toc`     | 220px       | post TOC column (only from 1200px)                                           |
| `--offset-header` | 96px        | space reserved for the sticky header: heading `scroll-margin-top`, TOC `top` |
| `--space-inline`  | 20/24/32px  | container horizontal padding by breakpoint                                   |
| `--space-section` | 40px / 48px | section vertical padding (mobile / desktop)                                  |
| `--radius-sm`     | 4px         | tag, code block                                                              |
| `--radius-md`     | 6px         | small elements needing a moderate radius (input, images, nav pill)           |
| `--radius-lg`     | 8px         | lab card, data table frame, header capsule                                   |
| `--radius-pill`   | 999px       | back-to-top button                                                           |
