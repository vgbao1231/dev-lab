# Motion Lab roadmap

Motion Lab is lab 02 of Dev Lab: a static React app that shows motion techniques as **runnable
demos**, each with a short API reference, pitfalls and the core snippet. It is demo-first, not a
benchmark and not a comparison: there is no bundle-size, LCP or "which library is faster" page.

This file is the lab's own plan. Portal rules (`AGENTS.md`, `docs/adr/`, `docs/design/`,
`docs/DESIGN_SYSTEM.md`) do **not** apply to this lab; the lab owns its stack, its visual identity
and its docs. Parallel work packages and file ownership: [`docs/WORKSTREAMS.md`](docs/WORKSTREAMS.md).

## Status

| Package              | Scope                                           | Status         |
| -------------------- | ----------------------------------------------- | -------------- |
| A — foundation       | shell, hash router, lazy registry, styles, docs | done           |
| B1 — variants        | variants + stagger demo                         | done           |
| B2 — gestures        | hover, tap, drag demo                           | done           |
| B3 — layout          | layout animation + `AnimatePresence` demo       | done           |
| B4 — scroll          | scroll-linked demo                              | done           |
| B5 — springs         | spring vs tween demo                            | done           |
| B6 — reduced motion  | reduced-motion demo                             | done           |
| C1 — content         | first portal article(s) + `motion` tag          | done           |
| C2 — release         | deploy docs, portal status, roadmap ticks       | deploy pending |
| D — visual alignment | shell, tokens, header/footer/breadcrumb, docs   | done           |

B1–B6 are independent: each owns one folder under `src/demos/` and can run in parallel. C1 touches
portal content only, so it can also run in parallel. C2 runs last.

## Phase A — foundation (done)

- [x] Vite + React 19 + TypeScript strict + `motion` dependency
- [x] Hash routing (`#/`, `#/demos/<id>`) so the static build needs no rewrite rules
- [x] Auto-discovered demo registry: `meta.ts` eager, `index.tsx` lazy, one chunk per demo
- [x] Per-demo error boundary and loading fallback; a broken demo cannot take the lab down
- [x] Lab-owned styles: light/dark via `prefers-color-scheme`, reduced-motion guard
- [x] Shared primitives (`demo-row`, `demo-button`, `demo-hint`, `code-block`, …) in `src/styles.css`
- [x] Repo docs updated: portal roadmap points here; README describes the contract

## Phase B — demos (parallel)

One work package per demo. A package owns exactly one folder and nothing else:

```
src/demos/<id>/meta.ts     metadata (id, group, order, summary, api, pitfalls, code)
src/demos/<id>/index.tsx   default-exported component; imports ./styles.css
src/demos/<id>/styles.css  demo-specific classes, prefixed with the demo id
```

A demo is done when:

- [ ] it opens from the index and from its hash URL (`#/demos/<id>`)
- [ ] the interaction is real (button, toggle, drag, scroll), not an autoplay loop
- [ ] it uses the APIs named in `meta.api`; `meta.code` matches the actual code shown
- [ ] it holds at 390px and 1280px, in light and dark, with no horizontal scroll
- [ ] with `prefers-reduced-motion: reduce` it still communicates state and does not move
- [ ] keyboard-operable, focus visible, no hover-only information
- [ ] `pnpm --filter motion-lab typecheck` and `eslint` / `prettier --check` pass for the folder
- [ ] the demo stays inside its own chunk: no static import from `App.tsx`, `registry.ts` or another demo

Demo list and specs: `src/demos/*/meta.ts`. B1 variants, B2 gestures, B3 layout, B4 scroll,
B5 springs, B6 reduced motion.

## Phase C — content and release

- [x] C1: one article in `portal/src/content/posts/` with `lab: motion-lab`, and a `motion` tag in
      `@dev-lab/tags`; 2–3 tags per article rules still apply
- [ ] C2: Cloudflare Pages project for the lab (`pnpm --filter motion-lab build`, output
      `labs/motion-lab/dist`), then set `status` / `href` for `motion-lab` in `portal/src/data/labs.ts`
- [x] C2: tick the Phase 2 boxes in `docs/ROADMAP.md`, add the deploy row to the root `README.md`,
      add a CHANGELOG entry for the lab release

## Phase D — visual alignment (done)

Goal: the lab reads as part of Dev Lab without copying the blog's digital-garden identity. The shared
grammar is warm neutrals, Be Vietnam Pro + JetBrains Mono, an 880px measure, border-led sections and
the same header → content → footer rhythm; the lab keeps a violet accent and its own demo stage.

- [x] Tokens: one `--lab-*` source in `src/styles.css`, warm neutrals shared with the portal, violet
      accent, `light-dark()` so each token is declared once
- [x] Shell: header with brand, mono nav and a tối / sáng / hệ thống switch (`src/lib/useTheme.ts`),
      breadcrumb with demo counter, stage frame, notes, snippet, prev/next pager, mono footer
- [x] Index: hero plus one grid of demo cards with group label and number
- [x] Docs: [`docs/DESIGN.md`](docs/DESIGN.md) is the contract; `README.md` describes the visual
      language and the mode switch
- [x] Reference mockup `design-reference/motion-lab/` followed for layout and type, not copied

Reduced motion stays an OS-level setting: demos read `useReducedMotion()`, so the mockup's global
"giảm chuyển động" header toggle is intentionally not shipped (see `docs/DESIGN.md`).

## Completion criteria

- Six demos, each reachable and each in its own chunk
- At least one portal article tagged `motion`, linked to a demo
- Lab deployed and linked from the portal's `/labs` page
- `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` passes at the repo root

## Non-goals

- No benchmark or library-comparison page (product decision, see portal
  `../../docs/PROJECT_OVERVIEW.md`)
- No backend, CMS, auth or runtime data
- No shared design tokens with the portal, but the same visual grammar: warm neutral ground, the
  portal's two font families, an 880px measure and border-led sections. The accent, the demo stage
  and the lab's own `--lab-*` token names stay lab-specific.
- No demo that auto-plays for more than a few seconds; the reader drives the interaction
