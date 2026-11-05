# Motion Lab design

The lab owns this document. Portal ADRs, `docs/design/` and `docs/DESIGN_SYSTEM.md` describe the
portal and do not apply here. This file is the source of truth for Motion Lab's UI; `src/styles.css`
implements it.

## Relationship to the portal

The two sites should read as one project without looking identical:

- **Shared grammar** — warm neutral ground (`#f7f4ed` / `#171614`), Be Vietnam Pro for copy,
  JetBrains Mono for metadata, an 880px measure, border-led sections, small uppercase mono labels,
  and the same header → content → footer rhythm.
- **Lab identity** — a violet accent (`#5a48c8` / `#a99bff`) instead of the portal's moss green, a
  10px card radius, a demo `stage` frame with its own bar, and a mode switch in the header. The lab
  is about movement, so the accent has to read as "motion", not "garden".

Reference mockup: `design-reference/motion-lab/` (read-only, never built or edited).

## Tokens

All values live in `src/styles.css` under `:root`; components and demos use the `--lab-*` variables
and never hard-code colour, font, size, radius or duration.

| Token                 | Light     | Dark      | Use                                   |
| --------------------- | --------- | --------- | ------------------------------------- |
| `--lab-bg`            | `#f7f4ed` | `#171614` | page ground                           |
| `--lab-surface`       | `#fffcf6` | `#24221f` | cards, stage, code blocks             |
| `--lab-surface-muted` | `#f0ece2` | `#2c2a26` | pressed buttons, inner demo panels    |
| `--lab-text`          | `#292720` | `#f2ebdd` | body copy                             |
| `--lab-text-muted`    | `#756f64` | `#b6ada0` | leads, labels, pitfalls               |
| `--lab-border`        | `#e3ddd1` | `#3a3630` | every rule and card edge              |
| `--lab-accent`        | `#5a48c8` | `#a99bff` | values, links, focus ring, active tab |
| `--lab-accent-soft`   | `#ece7ff` | `#2a2545` | demo highlight backgrounds            |
| `--lab-danger`        | `#a3231f` | `#ff8a84` | error boundary only                   |

**Mode** — the palette is declared once with `light-dark()`. `<html>` has no `data-mode` by default,
so the OS preference wins; the header switch sets `data-mode="light"` or `data-mode="dark"` and
stores the choice in `localStorage['motion-lab:mode']`. The inline script in `index.html` applies the
stored value before React mounts, so there is no flash of the wrong palette.

**Type** — `--lab-text-2xs` (12px) is metadata: mono labels, breadcrumb, API lines, buttons.
`--lab-text-sm` (14px) is demo copy, `--lab-text-base` (16px) is article copy, `--lab-text-lg` (19px)
is the page lead, `--lab-text-2xl` (34px) is a demo title, `--lab-text-hero` is index-only.

**Space and layout** — 4/8/12/18/28/44/72px scale; `--lab-width-page: 880px` for header, main and
footer; `--lab-width-content: 680px` for prose. Gutters are 20px, then 24px at 768px and 32px at
1024px.

**Motion** — `--lab-duration-fast` (120ms) / `--lab-duration-base` (200ms) and one easing curve.
Only `opacity` and `transform` are animated. Demos bring their own `motion` transitions; the shell
stays quiet.

## Shell

- **Header** — brand `Motion Lab.` with a violet square mark, then mono links (`demo`, `Dev Lab ↗`)
  and the segmented mode switch. One bottom border; not sticky, so it never competes with the demo
  stage.
- **Breadcrumb** — mono `demo / <id>` on the left, `05 / 06 · <group>` on the right. The current id
  is `aria-current="page"`.
- **Stage** — the demo lives in a bordered surface card. The bar above it names the stage and the
  position (`stage · springs`, `05 / 06`); the body has a 18rem minimum height so the page does not
  jump when a demo mounts.
- **Notes** — `API chính` and `Cạm bẫy` side by side above a hairline, API names in mono accent,
  pitfalls in muted body copy.
- **Snippet** — one bordered code block, `JetBrains Mono` 13px.
- **Pager** — previous/next demo with their numbers (`← 04 · scroll`), accent coloured.
- **Footer** — mono, one border on top: `© <year> Dev Lab` left; portal, source and lab line right.
- **Index** — hero, then a group filter row (`tất cả` plus one chip per group, count on the
  right), then one grid of demo cards. Each card starts with a 72px preview band, followed by the
  group + number row, title, summary and API line.

## Card preview

A card has to show what a demo feels like before it is opened. Every demo declares
`preview: DemoPreview` in its `meta.ts`; the shell renders one shared 72px band
(`src/components/DemoPreview.tsx`) and CSS does the rest.

| Kind      | What the band shows                                                |
| --------- | ------------------------------------------------------------------ |
| `spring`  | a dot overshoots a goal line, then settles                         |
| `stagger` | four blocks arrive one after another                               |
| `gesture` | a pointer reaches a target and the target grows, then springs back |
| `layout`  | one block moves to the bottom slot while the others close the gap  |
| `scroll`  | a thumb travels down its track while a progress bar fills          |
| `reduce`  | the dot jumps straight to the end, no easing                       |

Rules:

- The preview is **not** the demo. It is a one-shot CSS animation, 900ms, no React state, no extra
  chunk, and the demo folder does not ship a second implementation.
- The resting state (base CSS) is the end state, so when the animation is disabled the card still
  reads correctly.
- It runs once on mount and replays on hover or focus: the card remounts the preview with a `key`
  bump. Nothing loops, nothing plays on a timer.
- `aria-hidden="true"`: the title and summary carry the meaning; the preview is decoration.
- A new demo reuses an existing kind. A new kind is a shell change (package A) and a row in this
  table, not something a demo package invents.

## Demo primitives

Demos reuse the shared classes from `src/styles.css`: `demo-row`, `demo-button`, `demo-hint`,
`demo-output`, `chip`, `demo-error`. Buttons are mono 12px with a 6px radius; a pressed button flips
to accent background with `--lab-bg` text, which stays legible in both modes.

A demo may style its own stage contents, but not the shell: no new tokens, no hard-coded colours, no
gradients or glow, and no fixed positioning outside its own box.

## Accessibility

- Light and dark both come from tokens with contrast checked; the accent passes on both grounds.
- `:focus-visible` is a 2px accent outline with 3px offset, never removed.
- Everything is keyboard-operable; the mode switch is a `role="group"` of `aria-pressed` buttons, and
  the index filter uses the same pattern with a `role="status"` count.
- There is no hover-only information: the card preview also plays on keyboard focus.
- `prefers-reduced-motion: reduce` is honoured twice: the global CSS guard shortens shell
  transitions, and each demo reads `useReducedMotion()` to swap movement for an instant state change.
  The mockup showed a global "giảm chuyển động" toggle in the header; it is deliberately not shipped,
  because demos read the OS setting, so a header switch would either lie or need to be threaded
  through every demo.

## Changing this design

Update this file first, then `src/styles.css`, then the components. A new colour, font or size is a
new token, not a literal in a component. Keep the portal's grammar unless there is a reason the lab
needs to break it — and write that reason down here.
