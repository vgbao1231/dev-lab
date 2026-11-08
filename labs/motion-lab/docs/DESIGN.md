# Motion Lab design

The lab owns this document. Portal ADRs, `docs/design/` and `docs/DESIGN_SYSTEM.md` describe the
portal and do not apply here. This file is the source of truth for Motion Lab's UI; `src/styles.css`
implements it.

## Relationship to the portal

The two sites should read as one project without looking identical:

- **Shared grammar** — warm neutral ground (`#f7f4ed` / `#171614`), Be Vietnam Pro for copy,
  JetBrains Mono for metadata, a wide frame with a 720px prose measure, border-led sections, small
  uppercase mono labels, and the same header → content → footer rhythm.
- **Lab identity** — a violet accent (`#5a48c8` / `#a99bff`) instead of the portal's moss green, a
  10px card radius, a demo `stage` frame with its own bar, and a mode switch in the header. The lab
  is about movement, so the accent has to read as "motion", not "garden". The frame goes one step
  wider than the portal's 1120px to 1280px, because a demo needs room to travel.

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

**Space and layout** — 4/8/12/18/28/44/72px scale; `--lab-width-page: 1280px` for header, main and
footer, wider than the portal's 1120px frame so a demo has room; `--lab-width-content: 720px` for prose.
Gutters are 20px, then 24px at 768px and 32px at 1024px. The index grid fits three cards from 1024px
and two from 768px.

**Motion** — `--lab-duration-fast` (120ms) / `--lab-duration-base` (200ms) and one easing curve.
Preview and backdrop motion animate `opacity` and `transform` only. Demos bring their own `motion`
transitions; the rest of the shell stays quiet.

## Shell

- **Header** — brand `Motion Lab.` with a violet square mark, then mono links (`demo`, `playground`,
  `Dev Lab ↗`), a `tìm` search pill with its keyboard shortcut, and the segmented mode switch. One
  bottom border; not sticky, so it never competes with the demo stage.
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
- **Index** — a two-column hero (title + lead, and a mono spec sheet listing demo count, group count,
  stack and loading model), then a group filter row (`tất cả` plus one chip per group, count on the
  right), then one grid of demo cards. Each card is a bordered surface: a preview stage across the top,
  then group + number, title, summary and API line in a padded body.

## Search

`Ctrl/⌘ + K` (or `/` when not typing) opens the search dialog; the header also has a `tìm` pill.
There is no index request: the entries are built from the eager `meta.ts` files plus two page
entries, so results never go stale and the lab needs no `/search-index.json`.

- **Results** show the group badge, title and API line. The demo `pitfalls` are part of the haystack,
  so searching `drag` finds the gesture demo even though the word is not in its title or summary.
- **Keyboard** — `↑`/`↓` move, `↵` opens, `esc` closes. It is a native `<dialog>` opened with
  `showModal()`, so focus is trapped while open and returns to the trigger on close.
- **Semantics** — combobox + listbox (`role="combobox"`, `aria-activedescendant`, `role="option"`),
  with the result count announced through a polite live region.
- **Mobile** the trigger collapses to the icon and the dialog moves up to 6vh; results stay one column.

## Backdrop

The page is not a flat black/cream canvas. Two layers give Motion Lab its own ground without turning
the content into decoration:

- **Bloom** — a soft violet radial gradient tint mixed from `--lab-accent` into `--lab-bg`, painted on
  `<body>` at the top of the page.
- **Backdrop** — one fixed, `aria-hidden` layer behind the app with three large accent blooms and five
  thin light streaks that travel across the viewport. The streaks are the lab's signature: the portal
  uses organic blobs and floating dust, Motion Lab uses velocity.

The blooms drift on a 26s keyframe cycle and react to the pointer with a small parallax (one
`requestAnimationFrame` loop that stops when it settles). Only `opacity` and `transform` are animated.
The entire layer, including the parallax, is disabled under `prefers-reduced-motion`; the static
gradient stays so the page never loses its ground. Because the layer is fixed, it continues behind the
header and footer while the page scrolls.

## Card preview

A card has to show what a demo feels like before it is opened. Every demo declares
`preview: DemoPreview` in its `meta.ts`; the shell renders one shared preview stage
(`src/components/DemoPreview.tsx`) and CSS does the rest.

The stage is a 16:9 band across the full card width, so it is large enough to read at a glance. It has
a faint dot grid, a caption row with the kind name, a plain-language description of the motion and a
replay glyph, then the card body below. The caption is the recognition aid: a reader who has never
opened a demo can tell the kinds apart from words, not only from the shape.

| Kind      | What the band shows                                                 | Caption                  |
| --------- | ------------------------------------------------------------------- | ------------------------ |
| `spring`  | a dot overshoots the goal line, leaves a trail, then settles        | vượt đích rồi dừng       |
| `stagger` | five bars arrive one after another, 90ms apart                      | lần lượt, cách nhau 90ms |
| `gesture` | a pointer reaches a button, presses it, drags it and releases       | trỏ vào, chạm, kéo       |
| `layout`  | the top row moves to the bottom slot while the others close the gap | hàng đổi chỗ, không nhảy |
| `scroll`  | a viewport scrolls while the thumb and progress bar follow          | cuộn tới đâu chạy tới đó |
| `reduce`  | the dot jumps straight to the end, no easing, with a `0ms` tag      | nhảy thẳng, bỏ easing    |

Rules:

- The preview is **not** the demo. It is a one-shot CSS animation, no React state, no extra chunk,
  and the demo folder does not ship a second implementation.
- Geometry uses container query units (`cqw`/`cqh`) inside the stage, so one set of keyframes works at
  every card width; no pixel positions per breakpoint.
- The resting state (end of the animation) is the correct end state, so when animation is disabled
  the card still reads correctly.
- It runs once on mount, replays when the card first enters the viewport, and replays on hover or
  focus: the card remounts the preview with a `key` bump. Nothing loops, nothing plays on a timer.
- The visual is `aria-hidden="true"`: the caption, title and summary carry the meaning; the preview is
  decoration.
- A new demo reuses an existing kind. A new kind is a shell change (package A), a `PREVIEW_LABELS` row
  and a table row here, not something a demo package invents.

## Playground

`#/playground` is the learning surface: a live stage on the left, an editable snippet on the right.
It is a lazy route, so the index never downloads the editor or its CSS. A demo page links to it with
`#/playground/<demo-id>`, which loads that demo's own vanilla snippet from
`src/playground/demoSnippets.ts`: the demos are React components, so the snippet translates the same
idea to `animate`, while the read-only React block keeps the original code.

- **Presets** — `spring`, `tween`, `stagger` and `easing`, each a short snippet plus one sentence about
  what to change. The active preset stays visible; editing the code marks it `đã sửa`.
- **Demo snippets** — every demo has a vanilla translation (`variants`, `gestures`, `layout`, `scroll`,
  `springs`, `reduced-motion`) and a sentence about what differs from the React version. The preset
  chips stay available; choosing one leaves the demo source and loads that preset. Both kinds live in
  the lazy playground chunk, so the index does not pay for them.
- **Stage** — a measured lane with one box and five dots. `distance` is the lane width minus the box
  and its insets, so the same snippet travels the full lane at every viewport.
- **Editor** — a plain `<textarea>`; no editor dependency. The snippet runs locally through
  `new Function` with `animate`, `stagger`, `box`, `dots` and `distance` in scope. The code never comes
  from the URL or storage and is never sent anywhere, so a shared link cannot run code. Long lines
  wrap inside the panel instead of scrolling sideways, so a snippet stays readable on a phone.
  `Tab` inserts two spaces; `Esc` releases the trap for one press, so the next `Tab` leaves the editor.
- **Playback** — auto-run 600ms after typing stops, plus Run (`Ctrl/⌘ + Enter`), replay, pause/resume
  and 0.25×/0.5×/1×/2× speed. Errors are shown inline. Every run stops the previous animations and
  remounts the stage nodes before starting: the DOM `animate` keeps per-element state, so a reused
  box would treat the finished value as both start and target and the second run would look frozen.
  A fresh node per run keeps replay honest without touching Motion internals.
- **Reduced motion** — the playground does not auto-run when the OS asks for reduced motion; the
  reader presses Run explicitly. This keeps the accessibility stance without removing the feature.
- **Spring curve** — when the snippet asks for `type: 'spring'`, a small SVG under the stage plots
  position over time for the `stiffness`, `damping` and `mass` values written in the code, against a
  dashed target line. It also states `ζ`, overshoot and settle time, so the numbers have a shape to
  look at. The curve comes from the analytic spring solution, not an animation loop: one render per
  edit, no ticking, and it stays still under reduced motion. A snippet without a spring transition
  hides the graph rather than guessing.
- **React** — every preset and demo snippet also carries a read-only `motion/react` version behind a
  `<details>`, so a reader can compare `animate(box, …)` with `motion.div` props without leaving the
  page. Only the vanilla snippet executes; live JSX would need a browser compiler and is out of scope.

The provider is deliberately small: one snippet, one stage, no import system or JSX compiler. Editing
React components live is a separate, much heavier problem and is not part of this route.

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
  the index filter uses the same pattern with a `role="status"` count. The search dialog adds
  `Ctrl/⌘ + K`, arrow keys and `esc`, and returns focus to its trigger.
- There is no hover-only information: the card preview also plays on keyboard focus.
- `prefers-reduced-motion: reduce` is honoured twice: the global CSS guard shortens shell
  transitions, and each demo reads `useReducedMotion()` to swap movement for an instant state change.
  The playground goes further and stops auto-running, so movement only happens on an explicit Run.
  The mockup showed a global "giảm chuyển động" toggle in the header; it is deliberately not shipped,
  because demos read the OS setting, so a header switch would either lie or need to be threaded
  through every demo.

## Changing this design

Update this file first, then `src/styles.css`, then the components. A new colour, font or size is a
new token, not a literal in a component. Keep the portal's grammar unless there is a reason the lab
needs to break it — and write that reason down here.
