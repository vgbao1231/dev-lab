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
src/
├── App.tsx                 shell: header, index page, demo page, Suspense + error boundary
├── main.tsx                entry point
├── styles.css              shared design tokens and primitives (shell only)
├── lib/useHashRoute.ts     tiny hash router (#/ and #/demos/<id>)
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

`vite build` should emit one JS chunk per demo. If a demo's code shows up in the entry chunk, some
file imported it statically.

A folder with `meta.ts` but no `index.tsx` is skipped, so a demo can be written without breaking the
build for everyone else.

## Working in parallel

The lab is split into packages that own disjoint folders; see [`ROADMAP.md`](ROADMAP.md) and
[`docs/WORKSTREAMS.md`](docs/WORKSTREAMS.md). Do not edit another package's files, do not add
dependencies, and do not run repo-wide formatters or builds while another package is in progress.

## Status

Scaffold in progress: shell, routing and the lazy registry are in place; the six demos are being
written by separate packages. Cloudflare Pages project: not created yet (build command
`pnpm --filter motion-lab build`, output directory `labs/motion-lab/dist`, root directory `/`).

## Notes

- The lab owns its visual identity: portal design tokens and ADRs do not apply here.
- No backend, CMS or auth; the build is fully static.
