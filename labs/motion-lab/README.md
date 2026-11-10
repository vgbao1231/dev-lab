# Motion Lab

Lab 02 of Dev Lab. A static React app that demonstrates motion techniques: one page per demo, each
with a live example, the apis it uses, the pitfalls, and the core snippet.

Demo-first, not a benchmark: there is no bundle-size or library-comparison page.

- Stack: React 19, TypeScript (strict), Vite, `motion`
- Run locally: `pnpm --filter motion-lab dev` (http://localhost:5173)
- Build: `pnpm --filter motion-lab build` → `labs/motion-lab/dist`
- Typecheck: `pnpm --filter motion-lab typecheck`

## Structure

```
public/
├── _headers              Cloudflare Pages caching + security headers
├── favicon.svg
├── apple-touch-icon.png
└── og.png                social card
src/
├── App.tsx                 shell: header, index page, demo page, Suspense + error boundary
├── main.tsx                entry point
├── styles.css              shared design tokens and primitives (shell only)
├── components/Backdrop.tsx    fixed blooms + light streaks behind the app
├── components/DemoPreview.tsx one-shot card preview stage used by the index
├── components/SearchDialog.tsx  Ctrl/⌘+K search over the demo metadata
├── playground/
│   ├── PlaygroundPage.tsx     live snippet editor + stage (#/playground)
│   ├── SpringCurve.tsx        spring graph read from the snippet parameters
│   ├── demoSnippets.ts        vanilla translation of every demo, lazy
│   ├── presets.ts             editable starting snippets + read-only React view
│   ├── runSnippet.ts          local snippet runner (vanilla animate)
│   ├── springCurve.ts         analytic spring curve + stats (no DOM)
│   └── styles.css             playground-only styles, shipped lazily
├── lib/search.ts           normaliser + scoring shared by the search dialog
├── lib/useHashRoute.ts     tiny hash router (#/ and #/demos/<id>)
├── lib/useTheme.ts         light / dark / system switch, persisted
└── demos/
    ├── registry.ts         auto-discovers demo folders via import.meta.glob
    ├── types.ts            DemoMeta / Demo contract
    ├── DemoBoundary.tsx    one broken demo does not take the lab down
    └── <id>/
        ├── meta.ts         metadata imported eagerly (small, no React)
        ├── index.tsx       demo component, imported lazily
        └── styles.css      demo styles, shipped with that demo's chunk
```

## The one rule that keeps it fast

The index page must never download a demo the reader did not open. That is why:

- `registry.ts` imports `meta.ts` eagerly and `index.tsx` through `import.meta.glob` (dynamic imports)
- nothing statically imports a demo component, not even `App.tsx`
- each demo folder imports its own `styles.css`, so its CSS ships with its chunk
- `PlaygroundPage.tsx` is a `lazy()` route, so the index does not download the editor either
- search reads the eager `meta.ts` entries in memory, so it needs no index request and stays in the
  shell chunk (a few KB)

`vite build` should emit one JS chunk per demo. If a demo's code shows up in the entry chunk, some
file imported it statically.

A folder with `meta.ts` but no `index.tsx` is skipped, so a demo can be written without breaking the
build for everyone else.

## Visual language

The lab looks like Dev Lab without looking like the blog. It borrows the portal's grammar — warm
neutral ground, Be Vietnam Pro for copy, JetBrains Mono for metadata, a 1280px frame and border-led
sections — and keeps a violet accent plus its own demo stage for the motion identity. The page sits on
a violet bloom gradient, with a fixed layer of drifting blooms and travelling light streaks behind the
content. Palette, type, spacing and shell rules live in [`docs/DESIGN.md`](docs/DESIGN.md);
`src/styles.css` implements them and is the only place tokens are declared.

The header carries a tối / sáng / hệ thống switch; the choice is stored in
`localStorage['motion-lab:mode']` and applied before React mounts. Reduced motion still follows the
OS setting, because every demo reads `useReducedMotion()`.

## Working in parallel

The lab is split into packages that own disjoint folders; see [`ROADMAP.md`](ROADMAP.md) and
[`docs/WORKSTREAMS.md`](docs/WORKSTREAMS.md). Do not edit another package's files, do not add
dependencies, and do not run repo-wide formatters or builds while another package is in progress.

## Status

The six demos are live (each in its own chunk), the shell has been aligned with the Dev Lab visual
grammar, and the first article is published. The seventh demo, `while-in-view`, adds viewport
reveals (`whileInView`, `viewport.root`, `once`, `amount`) and reuses the `scroll` preview kind. The playground (`#/playground`) is live as a lazy route:
it turns a demo into an editable vanilla `motion` snippet with a measured stage, playback controls and
inline errors, without adding a dependency, plus a read-only React version of each preset. When a
snippet uses a spring, a small SVG plots the curve from its `stiffness`, `damping` and `mass` with
`ζ`, overshoot and settle time. Search (`Ctrl/⌘ + K` or `/`) filters demos, APIs and pitfalls straight
from the eager metadata. The lazy registry keeps unopened demos out of the entry bundle. The lab is
not deployed yet; see [Deploy](#deploy).

## Deploy

Motion Lab is its own Cloudflare Pages project, built from the repository root:

| Setting                | Value                                          |
| ---------------------- | ---------------------------------------------- |
| Project                | `motion-lab-gura` (check the name is free)     |
| Production branch      | `main`                                         |
| Build command          | `pnpm --filter motion-lab build`               |
| Build output directory | `labs/motion-lab/dist`                         |
| Environment variables  | `NODE_VERSION=22.22.0`, `PNPM_VERSION=12.14.0` |

Hash routing means no rewrite rules are needed. [`public/_headers`](public/_headers) is copied into
`dist` as-is and sets long-lived caching for `/assets/*`, plus `nosniff` and a strict referrer
policy; the HTML stays revalidated so a deploy is visible immediately.

Before the first production deploy:

1. Run `pnpm --filter motion-lab build` and `pnpm --filter motion-lab preview`, then open `/`, one
   demo, `#/playground`, and a hash route that does not exist (the not-found page should render).
2. Confirm the project name `motion-lab-gura` is free, then create the Pages project with the
   settings above. Leave branch previews off until the first production deploy works.
3. After the deploy, set `status: 'running'` and the Pages URL as `href` in
   `portal/src/data/labs.ts`, tick the Motion Lab deploy item in
   [`docs/ROADMAP.md`](../../docs/ROADMAP.md) and the lab's C2 item in [`ROADMAP.md`](ROADMAP.md),
   and add the release entry to [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md).

## Notes

- The lab owns its visual identity: portal design tokens and ADRs do not apply here, only the shared
  grammar described in [`docs/DESIGN.md`](docs/DESIGN.md).
- No backend, CMS or auth; the build is fully static.
