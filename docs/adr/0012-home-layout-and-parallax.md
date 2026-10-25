# 0012. Home page layout and background parallax effect

Status: Accepted
Date: 2026-10-24

## Context

The Dev Lab home page needs a visual refresh following the reference design at `design-reference/home-html/Main.dc.html` to complete its role as a personal portfolio and technical garden (Digital Garden vibe). The original design has these characteristics:

1. The home page background has a dark moss-green tone (`#0b0d09` with a deep moss-green `radial-gradient` from the top), accented with 4 large organic blobs and blurred floating dust particles that glow faintly.
2. A parallax effect that moves smoothly with the mouse pointer (`mousemove`) and page scroll (`scroll`), combined with an organic floating breathing animation for the blurred dust particles.
3. A two-column hero: on the left a greeting and navigation links; on the right a sprout illustration with the handwritten note `Small steps / Big progress`.
4. The `Các lab` section moves to a two-part layout: an intro sidebar on the left and a grid of cards on the right, with a 72px cover structure, a category chip, a serif title, and a status line.
5. Varied typography: `Caveat` for free-flowing handwriting (92px hero name, note) and `Lora` for serif headings.

## Decision

- **Fonts:** Add `Caveat`, `Lora`, and `Be Vietnam Pro` to the font tag in `BaseLayout.astro`, declared as tokens `--font-caveat`, `--font-serif`, `--font-sans` in `tokens.css`. The hero name uses Caveat at a large size (clamp up to 92px) and Lora for the Labs section / lab card headings.
- **Background and blobs, blurred dust particles:** Wrap the whole home page content in `.home-wrapper` carrying the background colour and radial gradient exactly as in the reference. The blobs and blurred dust particles (floating particles) sit in the `.home-deco` layer (`position: absolute; inset: 0; pointer-events: none`). Each blurred dust particle consists of an outer layer that receives the parallax transform and an inner layer (`.home-dot__glow`) running keyframes that float, blink, and glow gently, creating an ethereal feel (digital garden / fireflies). This decorative layer is hidden in Light mode to ensure contrast.
- **Parallax effect:** Implemented in plain TypeScript with `requestAnimationFrame` and normalised coordinates `nx, ny` in the range `[-0.5, 0.5]` (no over-scaling). A slow CSS `transition: transform` (1s - 2.8s) creates an organic lag. It listens to both `DOMContentLoaded` and the `astro:page-load` event to work correctly with View Transitions.
- **Accessibility:** Completely disable transitions and transforms when the system enables `prefers-reduced-motion: reduce`. All illustration graphics and decorative blocks are given `aria-hidden="true"`.
- **Lab card:** Update `LabCard.astro` to match the reference structure exactly: `border-radius: 12px`, 10px padding, an 8px-radius cover image with a height of 72px and a custom gradient per lab, a compact category chip, and a date/status meta line.

## Consequences

- The home page has rich visual depth and smooth interaction exactly as in the reference prototype without increasing bundle size (no additional external JS dependency).
- Consistency during navigation is maintained thanks to full compatibility with View Transitions.
- Light mode stays harmonious and clean thanks to automatically hiding the dark blobs and switching to a suitable light gradient.

## Implementation note (2026-10-25)

The current implementation uses **6** blobs and **62** dust particles, not the 4 blobs and 65 particles
recorded in the context and the 2026-10-24 changelog entry. The decision itself is unchanged. The
literal colours, sizes and durations used by this page are listed as known deviations in
`docs/DESIGN_SYSTEM.md`.
