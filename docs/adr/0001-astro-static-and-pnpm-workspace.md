# 0001. Static Astro portal, independent labs in a pnpm workspace

Status: Accepted
Date: 2026-10-17

## Context

Dev Lab is an ecosystem of many specialised labs, and each lab may use a different technology. Content is made of static files; there is no login, comments, or separate backend (see "Out of scope" in `PROJECT_OVERVIEW.md`). The priorities are load speed and low hosting cost.

## Decision

- The portal uses Astro with static output, plain CSS plus design tokens, and lives in `portal/`.
- The repo is a pnpm workspace containing `portal` and `labs/*`. Each lab is an independent application.
- The first lab is `react-lab` (React, TypeScript, Vite).
- Planned hosting: Cloudflare Pages (not connected yet).

## Consequences

- A new lab can choose its own stack without affecting the portal.
- Sharing design tokens between the portal and the labs, as well as how labs are placed (subdomain, subpath, or separate site), **has not been decided**.
- The portal build runs through Rolldown, so there is a `tsconfig` gotcha (see "Gotchas" in `AGENTS.md`).
