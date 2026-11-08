# React Lab

The first lab in Dev Lab: a React knowledge base plus runnable demos. It is a hybrid of the portal
(long-form articles) and Motion Lab (interactive stages), not a copy of either.

- **Stack:** Astro, React islands, MDX, TypeScript strict. No backend, CMS or runtime data.
- Run locally: `pnpm --filter react-lab dev`
- Build: `pnpm --filter react-lab build`
- Preview: `pnpm --filter react-lab preview`
- Typecheck: `pnpm --filter react-lab typecheck`
- Check everything: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` from the repo root

## Why Astro

The lab is a reading surface first: articles need real URLs, static output and metadata. Astro gives
that with the same content-collection pattern as the portal, while React stays available for demos as
islands. MDX lets an article embed a live demo later without a second pipeline.

## Structure

```
src/
├── content/knowledge/        articles; the file name is the slug
├── content.config.ts         frontmatter schema (source of truth)
├── pages/
│   ├── index.astro           hero, latest articles, topic grid
│   ├── kien-thuc/            article index and `/kien-thuc/<slug>`
│   └── 404.astro
├── layouts/BaseLayout.astro  document shell, theme init, skip link
├── components/               Header, Footer, ThemeToggle, PostCard, PostCover
├── data/                     labels, cover ids, date and reading helpers
├── assets/covers/            hand-drawn SVG covers inlined with lab tokens
└── styles/                   tokens.css + global.css
```

Routes are real paths (`/kien-thuc/...`), not hash routes, so a link can be shared and indexed.

## Writing an article

Create a Markdown or MDX file in `src/content/knowledge/`. Frontmatter:

| Field      | Rule                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `title`    | Vietnamese or English; technical terms stay in English                 |
| `date`     | `YYYY-MM-DD`                                                           |
| `type`     | `concept`, `guide` or `note`                                           |
| `topic`    | `hooks`, `lifecycle`, `rendering`, `state`, `performance`, `libraries` |
| `level`    | `co-ban`, `trung-cap` or `nang-cao`                                    |
| `tags`     | 1–4 ids from `@dev-lab/tags`, no duplicates                            |
| `summary`  | One or two sentences used on cards and in `<meta>`                     |
| `cover`    | Optional id listed in `src/data/covers.ts`                             |
| `coverAlt` | Required when `cover` is set                                           |
| `draft`    | `true` hides the article from lists and the build                      |

The build fails when a required field is missing or invalid. The topic and level labels live in
`src/data/content.ts`; a new topic is a content-model change, so update the schema, labels, topic grid
and docs in the same change.

## Status

The foundation is in place: Astro shell, content collection, article list and detail pages, light/dark
mode, and the three React articles moved here from the portal (Fiber, concurrent rendering, tearing).
Portal keeps general knowledge articles; lab-specific material lives with its lab.

Next: seed the hooks, lifecycle and libraries branches, then add interactive demos as React islands
(see [`ROADMAP.md`](ROADMAP.md)). The lab is **not deployed yet**; the Cloudflare Pages project,
build settings and post-deploy checklist are in the root [`README.md`](../../README.md#deploy).

## Notes

- The lab owns its visual identity. It shares the portal's warm ground and type families but keeps a
  cyan accent and its own `--lab-*` tokens; see [`docs/DESIGN.md`](docs/DESIGN.md).
- No new dependencies without agreement.
