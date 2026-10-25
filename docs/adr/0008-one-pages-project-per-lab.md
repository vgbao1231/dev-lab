# 0008. Each lab is its own Cloudflare Pages project

Status: Accepted
Date: 2026-10-20

## Context

Roadmap item 1.6 needs a place to put React Lab online, and how labs are placed was still listed in "Undecided items". Three options were considered:

- **Subpath inside the portal** (`/labs/react-lab`): the lab build has to be stuffed into `portal/dist`, Vite has to set `base` to that path, and every lab deploy redeploys the whole portal.
- **Separate Pages project per lab** (`react-lab.pages.dev`): the lab keeps its Vite configuration unchanged, and builds and deploys independently of the portal.
- **Subdomain of a custom domain** (`react-lab.<domain>`): cleanest in the long run but requires buying the domain first.

## Decision

- Each lab is its own Cloudflare Pages project, all pointing at the `dev-lab` repo.
- A lab project uses the repo root as its root directory, builds with `pnpm --filter <lab> build`, and outputs to `labs/<lab>/dist`.
- The portal links to a lab with an absolute URL via `href` in `portal/src/data/labs.ts`; the lab build is **not** embedded into the portal.
- Once a custom domain exists, attach a subdomain to each Pages project — no build configuration changes needed.

## Consequences

- Adding a new lab means adding a Pages project, without touching the portal. This fits "each lab is an independent application" in ADR 0001.
- Each lab has its own preview deployment per branch or pull request, without waiting for the portal build.
- Links from the portal to a lab are cross-origin: there is no shared navigation, and no shared layout or tokens between sites.
- Per-project configuration lives in README, section "Deploy".
