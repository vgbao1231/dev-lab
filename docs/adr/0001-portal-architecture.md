# 0001. Portal architecture: static Astro, pnpm workspace, independent labs

Status: Accepted
Date: 2026-10-17 (merged 2026-11-04)

## Context

Dev Lab is an ecosystem of specialised labs, and each lab may use a different technology. Content is
static files: there is no login, comments or separate backend (see "Out of scope" in
`PROJECT_OVERVIEW.md`). Priorities are load speed and low hosting cost. A lab also needs to build and
deploy without coupling to the portal.

Three ways of placing a lab were compared: a subpath inside the portal (the lab build has to be stuffed
into `portal/dist` and every lab deploy redeploys the portal), a separate Pages project per lab (the lab
keeps its own configuration and deploys independently), and a subdomain of a custom domain (cleanest in
the long run, but needs the domain first).

## Decision

- **Portal:** Astro with static output, plain CSS plus design tokens, in `portal/`.
- **Repo:** a pnpm workspace containing `portal`, `labs/*` and `packages/*`. Each lab is an independent
  application: its own `package.json`, stack and build script, and a `tsconfig.json` extending
  `tsconfig.base.json`.
- **Lab hosting:** each lab is its own Cloudflare Pages project, built from the repo root with
  `pnpm --filter <lab> build` and outputting to `labs/<lab>/dist`. The portal links to it with an
  absolute URL from `portal/src/data/labs.ts`; the lab build is never embedded in `portal/dist`.
- **Shared code:** only code that is really shared (for example `@dev-lab/tags`) lives in `packages/`
  and is consumed with `workspace:*`. Labs never import from `portal/`.
- A custom domain can later be attached as one subdomain per project, with no build changes.

## Consequences

- A new lab can choose its own stack without touching the portal build.
- Adding a lab means a package under `labs/`, a Pages project, and one entry in `labs.ts`.
- Portal and labs are cross-origin: no shared navigation, no shared layout. Whether labs reuse the
  portal's design tokens is still open.
- Lab builds and previews are independent: a lab deploy does not redeploy the portal.
- The portal build runs through Rolldown, so `portal/tsconfig.json` must not use array-form `extends`
  (see "Gotchas" in `AGENTS.md`).
- Per-project deployment configuration lives in README, section "Deploy".
