# React Lab roadmap

React Lab is the first lab in Dev Lab. It is a **hybrid**: a knowledge base like the portal and an
interactive demo surface like Motion Lab. Articles explain hooks, lifecycle, rendering, state,
performance and libraries; demos let a reader change the mechanism and watch it happen.

This file is the lab's own plan. Portal rules (`AGENTS.md`, `docs/adr/`, `docs/design/`) do not apply
to the lab; the lab owns its stack, visual identity and docs. Current stack: Astro + React islands +
MDX, static output.

**Current status (2026-11-08):** foundation and the three React articles are in place. Demos,
library guides, search and deploy are open.

## Phase 1 — foundation (done)

- [x] Astro + React integrations + MDX, static output, TypeScript strict
- [x] Content collection `knowledge` with frontmatter schema and topic/level model
- [x] Shared tag registry (`@dev-lab/tags`) and reading-time/date helpers
- [x] Shell: header, footer, theme toggle, skip link, light/dark via tokens
- [x] `/` home, `/kien-thuc` index, `/kien-thuc/<slug>` article page, 404
- [x] Hand-drawn covers moved from the portal and inlined with lab tokens
- [x] Move the three React articles out of the portal (Fiber, concurrent rendering, tearing)
- [x] `docs/DESIGN.md` as the visual and content contract

## Phase 2 — knowledge base

Seed the six topic branches with articles that stand on their own, in Vietnamese, technical terms in
English. Each article should explain the mechanism first, then show code and pitfalls.

- [ ] Hooks: `useState` batching, `useEffect` lifecycle/cleanup, `useMemo`/`useCallback`, custom hooks
- [ ] Lifecycle: mount → update → unmount, effect ordering, StrictMode double invocation
- [ ] Rendering: element tree, keys, suspense boundaries, server/client split
- [ ] State: local vs lifted vs external, reducers, context pitfalls
- [ ] Performance: render counts, `Profiler`, memoisation, when not to optimise
- [ ] Libraries: Redux Toolkit, React Hook Form, TanStack Query, Zustand, React Router
- [ ] Article-level navigation: previous/next in the same topic, related articles
- [ ] Cover set for the new articles (or the monogram fallback, documented)

A topic is "seeded" when it has at least three articles and one demo or code example.

## Phase 3 — interactive demos

Demos are React islands on their own real route (`/demo/<id>`), lazy where possible. Each demo has a
short explanation, the API it exercises, pitfalls and the core snippet — the same contract as Motion
Lab, adapted to React concepts.

- [ ] `/demo` index with cards and a one-line preview
- [ ] Reconciliation: change `key` and watch state survive or reset
- [ ] Effect lifecycle: mount/update/cleanup log with StrictMode comparison
- [ ] Batching and transitions: urgent vs transition updates on a large list
- [ ] Tearing: two consumers reading one external store
- [ ] Render profiling: count renders, `memo` on/off, before/after
- [ ] Reduced motion: demos keep their information without movement

## Phase 4 — library guides

Each guide names a pinned version, installs nothing at runtime, and shows the smallest useful setup,
the common patterns and the pitfalls. A guide may embed a demo when the behaviour is easier to see
than to read.

- [ ] Redux Toolkit: store, slices, typed hooks, when Redux is overkill
- [ ] React Hook Form: uncontrolled fields, validation, field arrays
- [ ] TanStack Query: cache, stale time, mutations, invalidation
- [ ] Zustand: minimal store, selectors, persistence
- [ ] React Router: nested routes, loaders, error boundaries
- [ ] A "choosing a library" decision page (not a benchmark)

## Phase 5 — discovery

- [ ] `Ctrl/⌘ + K` search over titles, summaries, topics, tags and pitfall text
- [ ] Filter by topic and level on `/kien-thuc` (client-side, no backend)
- [ ] RSS feed and sitemap
- [ ] Related articles and previous/next navigation

## Phase 6 — release

- [ ] Cloudflare Pages project (`react-lab-gura`) with the root build command and output directory
- [ ] Set `status` / `href` for `react-lab` in `portal/src/data/labs.ts`
- [ ] Tick the React Lab items in `docs/ROADMAP.md` and add a CHANGELOG entry
- [ ] Verify light/dark and 390px before the first deploy

## Completion criteria

- Six topic branches, each with at least three articles
- At least six interactive demos, each on its own lazy route
- At least four library guides with runnable examples
- Search and topic/level filters work without a backend
- Lab deployed and linked from the portal
- `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` passes at the repo root

## Non-goals

- No benchmark or "which library is fastest" page
- No backend, CMS, auth or runtime database
- No MDX compiler in the browser: demo code is authored in the repo, not typed by the reader
- No duplicate of the portal's general web knowledge (HTML, browser, internet, cache); that stays in
  the portal
