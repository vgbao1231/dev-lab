# Design System: Dev Lab

The design system for the portal and the labs. Minimalist, personal, content-first. Not a SaaS landing page.

This file is an **index**: principles (section 8), checklist (section 9) and a table showing where content lives. Details are split by topic under `docs/design/`; only read the file that matches the task at hand.

Section numbers 1–9 stay as in the original, because comments in the code still say "`docs/DESIGN_SYSTEM.md` mục N".

## Where section N lives

| Section | Content                                                     | File                                           |
| ------- | ----------------------------------------------------------- | ---------------------------------------------- |
| 1–3     | Theme × mode structure, palette, CSS variable conventions   | [`design/theme.md`](design/theme.md)           |
| 4       | Fonts, mono rules, type scale                               | [`design/typography.md`](design/typography.md) |
| 5       | Layout, header, footer, breakpoints, layout tokens          | [`design/layout.md`](design/layout.md)         |
| 6       | Components: card, tag, icon, cover, search, selectors       | [`design/components.md`](design/components.md) |
| 6       | Post page only: table of contents, `#` button, progress bar | [`design/post-page.md`](design/post-page.md)   |
| 7       | Motion: tokens, rules, catalogue, hover                     | [`design/motion.md`](design/motion.md)         |
| —       | Registry and shared tag rules for the portal + labs         | [`TAGS.md`](TAGS.md)                           |
| 8–9     | Principles, checklist, differences from `design-reference/` | this file                                      |

## Source of truth

- Docs decide, code implements. Changing color, font or tokens: edit the docs first, then `portal/src/styles/tokens.css`.
- `design-reference/` is only a reference for layout and color. When it differs from the docs, follow the docs and record it in the table at the end of this file.
- The reasoning behind design decisions lives in [`adr/`](adr/README.md), not in the spec files.

## 8. Principles

1. **Contrast:** primary text meets at least WCAG AA (4.5:1) against the background in every implemented theme × mode pair (currently: Minimalist Editorial light and dark). Check links and secondary text too.
2. **Minimal:** avoid nested cards, decorative gradients/glows and large illustrations. Agreed exceptions: 16:9 SVG covers for posts in [ADR 0009](adr/0009-manual-post-covers.md), and the home-page background/parallax decoration in [ADR 0012](adr/0012-home-layout-and-parallax.md). Do not extend either exception to other pages or components.
3. **One CTA:** at most one primary action per screen.
4. **Consistent:** layout and typography stay the same across themes. Only color changes.
5. **Personal:** content and the author's voice take priority over decoration.
6. **Purposeful motion.** Animation is optional; when present it follows section 7 (`design/motion.md`) and always respects `prefers-reduced-motion`.

## 9. Checklist

- [x] Contrast of `--color-text-muted` on `--color-surface`: 7.16:1 (dark) and 4.87:1 (light)
- [x] Contrast of `--color-link`: on background 8.49:1 (dark) / 5.24:1 (light), on surface 7.45:1 (dark) / 5.62:1 (light)
      — measured with the WCAG 2.1 formula (relative luminance) on 2026-10-18. Note: secondary text on surface in light mode is only 4.87:1, close to the AA threshold of 4.5:1, so it must not be lowered further.
- [x] Vietnamese rendering of Patrick Hand (Google Fonts `vietnamese` subset: U+0102-0103, U+0110-0111, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9)
- [ ] Keyboard focus state
- [ ] Are the "đang chạy" and "sắp tới" states of a lab card distinct enough when color alone is used
- [x] Animation respects `prefers-reduced-motion` (CSS guard in `global.css` + checks in
      `BaseLayout.astro` and `ThemeToggle.astro`)
- [x] Search: `Ctrl/Cmd+K` and `/`, `↑` `↓` navigation, `Enter`, `Esc`; accent-insensitive search; no
      runtime dependency added; dialog has the native `<dialog>` focus trap
- [x] Tags: the `@dev-lab/tags` registry is the single source; a wrong tag or more than 4 tags in frontmatter
      fails the build; displayed labels are normalized
- [x] Post covers: inline SVG using tokens, renders correctly in light/dark; posts without a cover get a
      monogram fallback; `coverAlt` required when a cover exists
- [x] `/bai-viet`: 1/2/3-column grid, 16:9 covers, one link per card; home page unchanged
- [x] Theme is not reset after navigating with View Transitions (copying `data-theme` /
      `data-mode` in `astro:before-swap`)
- [ ] Motion duration and JS bundle of `motion/mini` on mobile (Lighthouse Performance)
- [ ] Hover of links, nav, lab card and table rows matches section 7.4 (`design/motion.md`) in both light and dark
- [ ] Growing underline causes no layout shift; long in-post links do not break when they wrap
- [ ] Lab card without an address: no hover, no pointer cursor
- [ ] `filled` button uses `color-mix`, not a hard-coded darker accent color

## Known deviations (2026-10-25)

The following are real mismatches between this documentation and the current code. They are listed so
nobody mistakes them for approved patterns. Fix them; do not add new ones.

1. **Home decoration is an accepted exception, but its values are hard-coded.** The home page uses a
   background gradient, six blobs and 62 floating dust particles, with 2.4–2.8s transitions and
   infinite keyframes. This is allowed only for the home page by [ADR 0012](adr/0012-home-layout-and-parallax.md),
   and only as long as the decoration is `aria-hidden` and disabled under `prefers-reduced-motion`.
   The numbers in ADR 0012 and `CHANGELOG.md` (four blobs, 65 particles) are historical and no longer
   match the code.
2. **The home page and lab card still use literal values instead of tokens.** `portal/src/pages/index.astro`
   and `portal/src/components/LabCard.astro` contain literal colours (`#0b0d09`, `#efe9d6`,
   `#9a978a`, `#bcd1ad`, and others), type sizes (`0.9375rem`, `5.75rem`, `1.375rem`, `0.78125rem`,
   and others — all expressed in `rem`) and durations
   (0.3s, 0.35s, 1s, 2.4s, 2.8s). This breaks the token rule in section 4 and the colour rule in
   `docs/design/theme.md` section 3. It is also a light-mode contrast risk: `LabCard` is rendered on
   `/labs` outside `.home-wrapper`, so its pale `#efe9d6` title sits on the light `--color-surface`.
3. **The hero slogan is missing.** `docs/design/layout.md` specifies a `profile.slogan` note line under
   the tagline, but `portal/src/pages/index.astro` does not render it.
4. **The home section order differs from the spec.** `docs/design/layout.md` specifies
   hero → Dev Lab → About me → Labs; the code renders About me before Dev Lab.
5. **The footer says the site is deployed.** `Footer.astro` renders `Deploy trên Cloudflare`, while
   Phase 1.6 is still open and `PROJECT_OVERVIEW.md` says hosting is not connected.

## Note: intentional differences from `design-reference/`

`design-reference/` is a reference for layout and color. Its colors match section 2 (Minimalist Editorial + Digital Garden) exactly, so **there are no color differences**. The following points **intentionally do not** follow the reference:

| Point                | Reference                                              | Dev Lab                                                       | Reason                                                            |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Display font         | Balsamiq Sans, weight 700                              | Patrick Hand, weight 400                                      | Balsamiq Sans has no Vietnamese subset; Patrick Hand has 1 weight |
| Theme selector       | 4 combined buttons (2 themes × 2 modes), no "Hệ thống" | 2 independent axes, one `<select>` per axis, keeps "Hệ thống" | Keeps the two-axis model from section 1; native controls for a11y |
| Post title           | Inter 600, 17px                                        | display font, `--text-2xl`                                    | Inter currently only loads weights 400/500                        |
| Site structure       | one page, anchor navigation                            | separate pages `/labs`, `/bai-viet`, `/lien-he`               | Content will grow and needs its own URLs                          |
| Theme names          | short labels `ấm` / `dịu`                              | `Minimalist Editorial` / `Digital Garden`                     | Matches `src/data/themes.ts` and section 2                        |
| `filled` hover color | (none)                                                 | `color-mix(in oklab, accent 88%, bg)`                         | Does not add a new color variable                                 |
| Header               | none (no sticky layout)                                | sticky + blurred capsule on scroll + nav pill hover           | Requested addition, inspired by `ngockhoi96.dev`                  |
