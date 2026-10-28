# Dev Lab

Dev Lab is an ecosystem of technical blogs and labs, developed by [Gura](https://github.com/vgbao1231) as a long-term personal project. Content spans several areas — frontend, backend, DevOps — depending on the work and topics being explored.

Goal: share knowledge, reinforce existing knowledge through practice, and build products of high enough quality to put on a CV.

> Status: **Phase 1 in progress** — see [docs/ROADMAP.md](docs/ROADMAP.md).

## Tech stack

- Workspace: pnpm workspace, Node `>=22.22.0`, pnpm `12`
- Portal: Astro (static output), plain CSS + design tokens
- Motion: Astro View Transitions (`<ClientRouter />`) + `motion/mini` for entrance animations
- Content: Markdown/MDX through Astro content collections
- First lab: React, TypeScript, Vite
- Code quality: TypeScript `strict`, ESLint (flat config), Prettier
- Deploy: Cloudflare Pages (portal live; React Lab not deployed yet — see the Deploy section below)

## Repository layout

```
dev-lab/
├── .github/workflows/ci.yml  # CI: lint, format, typecheck, build
├── AGENTS.md                 # Instructions for AI agents (primary source)
├── README.md
├── docs/
│   ├── PROJECT_OVERVIEW.md   # Goals, audience, scope, settled and unsettled architecture
│   ├── ROADMAP.md            # Phases, checklists, completion criteria
│   ├── DESIGN_SYSTEM.md      # Design system index, principles, checklist
│   ├── TAGS.md               # Shared tag registry and rules for adding tags
│   ├── design/               # Per-topic specs: theme, typography, layout, components, post-page, motion
│   ├── adr/                  # Architecture/design decisions: why, and what was traded off
│   └── CHANGELOG.md          # History of design iterations
├── design-reference/         # Layout and colour references (HTML + screenshots), excluded from the build
├── eslint.config.js          # ESLint flat config shared by the whole workspace
├── prettier.config.mjs
├── tsconfig.base.json        # Shared strict TypeScript configuration
├── pnpm-workspace.yaml
├── portal/                   # Main site (Astro)
│   ├── public/
│   └── src/
│       ├── assets/covers/     # 16:9 SVG covers, inlined to use theme tokens
│       ├── components/        # Header, Footer, SearchDialog, Icon,
│       │                      # PostCard, PostCover, LabCard, PostList, ...
│       ├── content/posts/     # Markdown posts (filename = slug)
│       ├── content.config.ts  # Post collection + frontmatter schema
│       ├── data/              # Static data (labs, themes, profile, covers, icons, ...)
│       ├── layouts/
│       ├── lib/               # reading.ts, search.ts
│       ├── pages/             # /, /labs, /bai-viet, /bai-viet/<slug>, /lien-he, /search-index.json
│       └── styles/            # tokens.css, global.css
├── packages/
│   └── tags/                  # @dev-lab/tags — shared tag registry for the portal + labs
└── labs/
    └── react-lab/            # React + TypeScript + Vite lab
```

Each lab is a standalone app under `labs/` and may have its own stack and UI. Shared packages
(such as `@dev-lab/tags`) live in `packages/`.

## Requirements

- Node.js `>=22.22.0`
- pnpm `12` (declared in `packageManager`)

## Running locally

```bash
# Install dependencies for the whole workspace
pnpm install

# Run the portal in dev mode (http://localhost:4321)
pnpm dev

# Run a single lab
pnpm --filter react-lab dev

# Check code quality
pnpm lint
pnpm format:check
pnpm typecheck

# Build the whole workspace
pnpm build
```

| Command                             | What it does                                                      |
| ----------------------------------- | ----------------------------------------------------------------- |
| `pnpm dev`                          | Start the portal dev server                                       |
| `pnpm build`                        | Build every package (`pnpm -r build`)                             |
| `pnpm preview`                      | Preview the portal's production build                             |
| `pnpm lint` / `pnpm lint:fix`       | Run / auto-fix ESLint errors                                      |
| `pnpm format` / `pnpm format:check` | Format / check formatting with Prettier                           |
| `pnpm typecheck`                    | `astro check` for the portal and `tsc --noEmit` for labs/packages |

## Writing posts

Posts are Markdown files in `portal/src/content/posts/`; the filename becomes the slug in the URL. Required frontmatter:

| Field      | Type   | Notes                                                              |
| ---------- | ------ | ------------------------------------------------------------------ |
| `title`    | string | Post title                                                         |
| `date`     | date   | `YYYY-MM-DD`                                                       |
| `type`     | enum   | `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note`  |
| `lab`      | string | Lab slug, e.g. `react-lab`                                         |
| `tags`     | array  | 1–4 tag IDs from `@dev-lab/tags`, 2–3 recommended                  |
| `summary`  | string | One-sentence summary, shown in post lists                          |
| `cover`    | string | Cover key in `portal/src/data/covers.ts` (optional)                |
| `coverAlt` | string | Image description for screen readers; required when `cover` is set |

`draft: true` (optional) excludes a post from the build. The schema is validated at build time: a
missing field, a wrong `type`, a tag that is not in the registry, or more than four tags fails the
build. Tag conventions: [`docs/TAGS.md`](docs/TAGS.md).

> The three current React internals posts are real content; the sample post `bai-viet-mau.md` has been removed.

## Deploy (Cloudflare Pages) — runbook

**Status (2026-10-28): the portal is deployed.** The repo is connected to Cloudflare Pages and the
portal build is configured; the React Lab Pages project is **not** created yet
([docs/ROADMAP.md](docs/ROADMAP.md), section 1.6). The table and steps below document how both projects
are configured, so they are also the checklist for the remaining React Lab project.

The portal and **each lab are a separate Pages project**, all built from this repo. Rationale in [ADR 0008](docs/adr/0008-one-pages-project-per-lab.md).

| Setting                | Portal (`dev-lab-gura`)                        | React Lab (`react-lab-gura`)                   |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Repository             | `vgbao1231/dev-lab`                            | `vgbao1231/dev-lab`                            |
| Production branch      | `main`                                         | `main`                                         |
| Framework preset       | Astro (then override the build command)        | React (Vite) (then override the build command) |
| Root directory         | `/`                                            | `/`                                            |
| Build command          | `pnpm --filter portal build`                   | `pnpm --filter react-lab build`                |
| Build output directory | `portal/dist`                                  | `labs/react-lab/dist`                          |
| Environment variables  | `NODE_VERSION=22.22.0`, `PNPM_VERSION=12.14.0` | same as the portal                             |

Three things that are easy to get wrong:

- **The project name becomes the `*.pages.dev` address and cannot be changed after creation.** The name must be available across all of Cloudflare, not just your account. If you get it wrong, the only fix is to delete the project and create it again — which loses deployment history and means re-entering the environment variables. The names in the table are examples; check availability when you create the project.
- **Root directory must be the repository root.** `pnpm-lock.yaml` and `pnpm-workspace.yaml` live there; pointing at `portal/` or `labs/react-lab/` means the dependency install step cannot find the lockfile.
- **`NODE_VERSION` and `PNPM_VERSION` must be set.** The Pages v3 build image defaults to Node 22.16.0 and pnpm 10.11.1, below what this repo requires (`engines.node >= 22.22.0`, `packageManager pnpm@12.14.0`); v3 does not read `engines` or `packageManager` from `package.json`.

### Steps

1. Grant Cloudflare access to the repo: GitHub → **Settings → Applications → Cloudflare Pages** → allow the `vgbao1231/dev-lab` repo (one-time, shared by every project).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select `vgbao1231/dev-lab`.
3. Name the project, pick the production branch and fill in the configuration from the table above. The project name determines the `*.pages.dev` address (`dev-lab-gura` → `dev-lab-gura.pages.dev`).
4. Open **Environment variables (advanced)** → add `NODE_VERSION` and `PNPM_VERSION` for **both Production and Preview**.
5. **Save and Deploy** → read the build log → open the `*.pages.dev` address to verify.
6. Repeat from step 2 for React Lab (project name `react-lab-gura` → `react-lab-gura.pages.dev`).
7. Once React Lab is live: add `href` to `portal/src/data/labs.ts`. `LabCard` turns the card into a link automatically when `href` is present.

### Preview deployments

Once a project is connected, every push to a branch other than `main` — including pushes in a pull
request — makes Pages build a separate preview:

- The address looks like `https://<commit-hash>.<project>.pages.dev`; find it in the project's **Deployments** tab or in the bot comment on the pull request.
- Quick check: create a branch, push a small change, open the Deployments tab and confirm a new build appears.

This relies on the Pages Git integration, so no secrets or separate workflow are needed;
`.github/workflows/ci.yml` only checks code quality. Deploying from GitHub Actions (for example, to
publish performance measurements later) would require `cloudflare/wrangler-action` and an API token.

Cloudflare Pages builds previews by default. To turn that off and build only on `main`:
**Settings → Builds & deployments → Configure Preview deployments → Preview branch controls → `None`**,
leaving _Enable automatic production branch deployments_ checked. Trade-off: leaving previews on
costs one build per branch; turning them off means every change merged into `main` goes to production
immediately, with only CI checking it beforehand.

## Conventions

Code rules, gotchas and the definition of "done" live in [AGENTS.md](AGENTS.md); UI rules live in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Two things to know when developing on your own:

- Never hard-code colours, fonts, durations or easing: use the tokens in `portal/src/styles/tokens.css`.
- When you finish an item in `docs/ROADMAP.md`, tick it `[x]` in the same change.

## Documentation

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Roadmap](docs/ROADMAP.md)
- [Design system](docs/DESIGN_SYSTEM.md) and the specs in [docs/design/](docs/design/)
- [Architecture decisions (ADR)](docs/adr/README.md)
- [Agent instructions](AGENTS.md)

## License

Post content and source code are copyright Gura unless noted otherwise.
