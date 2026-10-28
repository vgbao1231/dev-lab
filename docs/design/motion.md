# Design: Motion

> Part of the design system; index and routing table in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Section numbers stay as in the original because comments in the code point to "mục N".

## 7. Motion (animation)

A minimal style means minimal motion too: the goal is to clarify state changes and hierarchy, not to decorate.
This section supplements the "Principles" part (section 8, `../DESIGN_SYSTEM.md`).

### 7.1 Tokens

| Token               | Value                           | Used for                                                    |
| ------------------- | ------------------------------- | ----------------------------------------------------------- |
| `--duration-fast`   | 120ms                           | hover, focus, border, text color                            |
| `--duration-base`   | 200ms                           | entrance, header hide/show, small changes                   |
| `--duration-slow`   | 320ms                           | page transition (View Transition)                           |
| `--duration-chrome` | 340ms                           | header chrome on scroll (background, border, capsule width) |
| `--ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)`    | default                                                     |
| `--ease-entrance`   | `cubic-bezier(0.16, 1, 0.3, 1)` | element appearing                                           |
| `--reveal-distance` | 8px                             | upward offset when an element appears                       |
| `--reveal-stagger`  | 60ms                            | delay between elements in the same batch                    |

### 7.2 Rules

1. Only animate `opacity` and `transform` for motion that changes position or size.
   Do not animate `width`, `height`, `margin`, `top`/`left` — it causes reflow and affects performance
   metrics. Paint-only properties such as `color`, `background-color`, `border-color`,
   `background-size`, `text-decoration-color` are allowed with `--duration-fast` (see section 7.4).
   **Exception:** the header chrome on scroll changes `max-width`/`padding-inline` (horizontal only,
   so page height does not change) and `background-color`/`border-color`/`border-radius`/
   `box-shadow`. Why: this is the header's signature effect, it only runs past a scroll threshold, and
   it only affects one small element. The exception must not be extended to other elements.
2. Maximum duration 340ms (`--duration-chrome`). No infinite looping animation, no
   overshooting bounce/spring. **Accepted exception:** the home-page blobs and dust particles from
   [ADR 0012](../adr/0012-home-layout-and-parallax.md) use 2.4–2.8s transitions and infinite keyframes.
   They are decorative, `aria-hidden`, and fully disabled under `prefers-reduced-motion: reduce`.
   Do not extend this exception to other pages or components.
3. Do not add gradients, glows or decorative effects through animation. The home-page decoration in
   ADR 0012 is the only accepted exception.
4. Every motion **must** be disabled when `prefers-reduced-motion: reduce`. This is a
   requirement, not an option.
5. Keep only animation that explains a state change or hierarchy; if it explains
   nothing, drop it.

### 7.3 Motion catalogue

| Group                  | How it is implemented                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page transition        | `<ClientRouter />`; the root does not animate, only `main` cross-fades                                                                                                        |
| Sticky header          | Scroll down: `translateY(-100%)`; scroll up: show again. The capsule changes background, border, radius, width                                                                |
| Shared elements        | matching `view-transition-name` on both pages, the element morphs instead of cross-fading                                                                                     |
| Theme / mode change    | `document.startViewTransition()` wrapping the `data-theme` / `data-mode` assignment                                                                                           |
| First page load        | `[data-animate]` elements fade in with `motion/mini`, stagger by token                                                                                                        |
| Back-to-top button     | Fades in past 600px of scroll; clicking smooth-scrolls (or jumps) to the top                                                                                                  |
| Post table of contents | Every item in view is marked per scroll position (multiple items can be active)                                                                                               |
| Reading progress       | 2px line at the top edge, length by percentage of the post scrolled; on supported browsers driven by `animation-timeline: scroll()`                                           |
| Home parallax          | Blobs, blurry dust particles (`dustParticles`) and the hero visual drift slightly with `mousemove` + `scroll` via TS + 2.4s–2.8s CSS transition; disabled with reduced motion |
| Micro-interaction      | Link, nav, lab card, post card, table row hover — see section 7.4                                                                                                             |

A shared element is currently wired for the **post title**: `PostList` sets
`view-transition-name: vt-post-<id>` on the title in the list, and the detail page sets the same name
on `h1`. The name must be a valid custom-ident (post ids start with a digit, hence the `vt-post-` prefix) and
**must not repeat** within a page.

Implementation details (in `portal/`):

- `[data-animate]` only runs on the **first page load**. In-site navigations are handled by
  View Transitions and do not re-run the entrance.
- The `.motion-ready` flag on `<html>` is inserted by an inline script **before paint**, and only when
  the user has not requested reduced motion. That way there is no flash, and content is never
  hidden when JavaScript fails.
- View Transitions replace all attributes of `<html>`, so `data-theme`, `data-mode` and
  `data-mode-preference` must be copied to the new document in `astro:before-swap`; otherwise the
  theme and mode preference would be reset after navigation.

### 7.4 Hover and interaction states

Principle: hover must **say something** (this element is clickable, or what state it is in).
Colour changes use `--duration-fast` (120ms); the small card lift uses `--duration-base` (200ms); both use
`--ease-standard`. No enlarging, no shadows. Movement stays small: 2px for post cards, 3px for lab cards
(the reference values); do not introduce larger offsets.

| Element                                | Default                       | Hover                                                                                      |
| -------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Link in content                        | no underline                  | underline fades in (short links: grows; in-post links: `text-decoration-color`)            |
| CTA link (`… →`)                       | no underline                  | growing underline + arrow shifts right 2px                                                 |
| Nav link                               | `--color-text-muted`          | `--color-accent` + translucent accent pill expanding                                       |
| Brand in header                        | `--color-text`                | `--color-accent`, no underline                                                             |
| Post title                             | `--color-text`                | `--color-link`                                                                             |
| Lab card (when it is a link)           | border `--color-border`       | border 42% accent mix + `translateY(-3px)`                                                 |
| Post card on `/bai-viet`               | border `--color-border`       | 55% accent border + `translateY(-2px)`; title to `--color-link`                            |
| Table row                              | transparent                   | background `--color-bg`                                                                    |
| TOC link                               | `--color-text-muted`          | `--color-text`; current item also gets `--color-surface` background + `--color-accent` bar |
| Copy button on post headings           | hidden (`opacity: 0`)         | shown + `--color-accent` (also shown on focus)                                             |
| `ghost` / `outlined` / `filled` button | button table, `components.md` | button table, `components.md`                                                              |

**Growing underline** — technique:

- Short links and CTA links: `background-image: linear-gradient(currentColor, currentColor)`,
  `background-repeat: no-repeat`, `background-position: 0 100%`, `background-size: 0 1px`; on
  hover change `background-size: 100% 1px`. No layout shift.
- Long in-post links: use `text-decoration-color: transparent → currentColor` to stay safe
  when the link wraps (the `background-size` technique breaks across lines).
- The `→` arrow of CTA links sits in `<span aria-hidden="true">` so it can move on its own without
  being repeated in screen readers.
- With `prefers-reduced-motion: reduce`: drop the growing effect and show the underline immediately.
