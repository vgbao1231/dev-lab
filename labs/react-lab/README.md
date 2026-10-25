# React Lab

The first lab in Dev Lab: React internals — hooks, rendering, state and performance, backed by real measurements.

- Stack: React 19, TypeScript (strict), Vite
- Run locally: `pnpm --filter react-lab dev`
- Build: `pnpm --filter react-lab build`
- Typecheck: `pnpm --filter react-lab typecheck`

## Status

The lab is currently a scaffold: a minimal React entry point (`src/main.tsx`, `src/App.tsx`) with
layout-only styles.

The published content lives in the portal, because posts belong to the portal's content collection
(`portal/src/content/posts/`). Three posts are live:

- **React Fiber & Reconciliation** (`react-fiber-va-reconciliation.md`) — element tree, Fiber tree, the render and commit phases, and why `key` decides whether state is kept or lost.
- **Concurrent Rendering: lanes and scheduling** (`react-concurrent-rendering-lanes-scheduling.md`) — lanes, the scheduler, interruptible rendering, and the limits of the commit phase.
- **Tearing & `useSyncExternalStore`** (`tearing-use-sync-external-store.md`) — snapshots, subscriptions, and how to avoid two components reading two versions of the same data.

Still open in Phase 1.5: the page comparing bundle size, JS, LCP and build time across labs.

## Notes

- Styles currently only cover layout. Whether labs share design tokens with the portal is
  undecided (see "Undecided items" in `docs/PROJECT_OVERVIEW.md`).
- No new dependencies without agreement (see `AGENTS.md`).
