# AGENTS.md

Instructions for AI agents (Claude Code, OpenCode, Cursor, Copilot, etc.) working in the Dev Lab repo.

## Project at a glance

- **What:** a static Astro portal (personal portfolio + technical blog) plus independent labs in a pnpm workspace. The portal introduces and links to the labs; each lab is its own app.
- **Stack:** Astro 7 static output, plain CSS + design tokens, View Transitions + `motion/mini`, content collections (Markdown/MDX). No backend, CMS, auth or database.
- **Shape:** `portal/` is the site, `labs/` holds standalone apps, `packages/tags` is the shared tag registry. Routes: `/`, `/labs`, `/bai-viet`, `/bai-viet/<slug>`, `/lien-he`.
- **Current phase:** Phase 1 — Foundation and the first React lab. Live status and open items: top of `docs/ROADMAP.md`. Known doc/code gaps: `docs/DESIGN_SYSTEM.md`.
- **Decisions:** one-line index in `docs/adr/README.md` — static Astro + workspace, two-axis theme/mode, sticky capsule header, View Transitions, shared tags, search palette, home layout/parallax, manual SVG covers, reading progress.
- **Source of truth:** docs decide, code implements. Values live in `docs/design/*`; ADRs keep only the reasoning.

## Language policy

This repo separates product language from project language.

- **English is required** for: documentation, ADRs, changelog entries, comments in code, commit messages, branch names, file and directory names, code identifiers, test names, and configuration comments.
- **Vietnamese is allowed only for**: article content (`portal/src/content/posts/`), UI copy shown to readers, data strings rendered in the UI (for example `profile.ts` values and lab status labels), and route slugs that are already public (`/bai-viet`, `/lien-he`).
- Do not translate technical terms that readers know in English (`useMemo`, `reconciliation`, `event loop`, `commit phase`).
- Do not mix languages in a new comment or document. If you touch a file with legacy Vietnamese comments, you may translate the comments in that file as part of the same focused change.
- Existing Vietnamese commit messages and branch names are history and are **not** rewritten.

## Commands

| Task                   | Command                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| Run the portal         | `pnpm dev` (http://localhost:4321)                               |
| Run one lab            | `pnpm --filter react-lab dev`                                    |
| Check (same as CI)     | `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` |
| Auto-fix lint / format | `pnpm lint:fix` / `pnpm format`                                  |

## Repository map

- `portal/src/pages/`: routes (`/`, `/labs`, `/bai-viet`, `/bai-viet/[...slug]`, `/lien-he`) and `search-index.json.ts`, which generates the search index at build time
- `portal/src/components/`: `.astro` components, one PascalCase file per component (header, cards, cover, icon, search, and so on)
- `portal/src/data/`: the single source of data. `profile.ts` (personal information), `labs.ts`, `themes.ts`, `content.ts` (`postTypes`), `covers.ts`, `icons.ts`
- `portal/src/lib/`: pure shared logic (`search.ts`, `reading.ts`) with no DOM dependency
- `portal/src/content/posts/`: posts; the file name is the slug
- `portal/src/content.config.ts`: frontmatter schema (source of truth for required fields)
- `portal/src/styles/tokens.css`: token values (colour, type size, spacing, motion)
- `packages/tags/`: shared `@dev-lab/tags` registry; the only source for tag IDs, labels and groups
- `docs/design/`: per-topic UI specs; `docs/adr/`: decisions and rationale; `docs/TAGS.md`: tag conventions; `docs/CHANGELOG.md`: design change history
- `labs/<name>/`: each lab is an independent app
- `design-reference/`: reference only; never build it, never edit it

## What to read first

Do not read all of `docs/`. Pick by task:

| Task                                                             | Read                                                                         |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| New to the project / orientation                                 | "Project at a glance" above + `docs/adr/README.md`                           |
| Colour, theme, colour tokens                                     | `docs/design/theme.md`                                                       |
| Fonts, type scale                                                | `docs/design/typography.md`                                                  |
| Page layout, header, footer, breakpoints                         | `docs/design/layout.md`                                                      |
| Components: cards, tag, link, button, facts table, mode dropdown | `docs/design/components.md`                                                  |
| Post detail page (table of contents, progress, `#` button)       | `docs/design/post-page.md`                                                   |
| Animation, hover, View Transitions                               | `docs/design/motion.md`                                                      |
| Writing or editing a post                                        | `portal/src/content.config.ts`, `portal/src/data/content.ts`, `docs/TAGS.md` |
| Proposing a feature or a new lab                                 | `docs/PROJECT_OVERVIEW.md`, top of `docs/ROADMAP.md`                         |
| Why the project is built this way                                | `docs/adr/`                                                                  |

Code comments say "`docs/DESIGN_SYSTEM.md` section N"; the table at the top of that file maps section N to the topic file.

If a request contradicts the documentation, ask the user instead of deciding unilaterally.

## General principles

- **Do not settle architecture decisions on your own.** The "Undecided items" section in `docs/PROJECT_OVERVIEW.md` is not decided: propose options with trade-offs and wait for confirmation.
- **Small scope, small changes.** One change solves one problem. Do not refactor or restructure beyond what was asked.
- **Do not add dependencies** without agreement. State the reason when proposing one.
- **Do not build a feature only to dogfood.** Using a technology to build the site is optional, not mandatory for every post.
- **Do not add gradients, glows or decorative effects** unless the design system or an accepted ADR already allows them. The current exception is the home-page decoration from ADR 0012; do not extend it to other pages or components.
- **Documentation decides, code implements.** If they disagree, report the disagreement; do not silently change the rule to match the code.

## Code rules

### TypeScript

- `strict` is enabled. Do not use `any` unless a comment explains why.
- Prefer `type` for props and simple data, `interface` when extension is needed.
- Variable and function names are English. Comments are English.
- Keep business logic out of JSX. Extract it into a hook or a pure function.

### React (in React labs)

- Function components only; no class components.
- One component per file, file name matches the component name (PascalCase).

### CSS and styling

- Colour, font, type size, duration and easing **must** come from tokens in `tokens.css`. Never hard-code them.
- Need a new token: update `docs/design/` first, then `tokens.css`, in the same change.
- Do not use inline styles for colour or font.
- Every animation must respect `prefers-reduced-motion`. For blocks that should fade in, add `data-animate`; do not write a one-off animation.
- The only accepted hard-coded values are the ones already documented as known deviations in `docs/DESIGN_SYSTEM.md`; do not add more.

### Post content

- Write in Vietnamese. Keep technical terms in English (`useMemo`, `reconciliation`, `event loop`).
- Frontmatter must include `title`, `date`, `type`, `lab`, `tags`, `summary`; add `cover` + `coverAlt` when the post has a cover. `type` is one of `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note`. `tags` uses IDs from `@dev-lab/tags`, 1–4 tags, no duplicates. The build fails when a required field is missing or wrong.
- Explain the mechanism first, then show code examples.

## Gotchas

- `portal/tsconfig.json` **must not** use an array-form `extends`: Rolldown (Vite inside Astro) resolves it incorrectly and the build breaks.
- The header uses `transition:persist`: its DOM survives navigations, so `aria-current` must be updated by JavaScript.
- View Transitions replace every attribute on `<html>`: copy `data-theme` / `data-mode` to the new document in `astro:before-swap`.
- `[data-animate]` runs only on the first page load. `view-transition-name` must be a valid custom-ident and must not repeat within one page (post titles use `vt-post-<id>`).
- `BaseLayout` renders a `background` slot as the first child of `<body>`, outside `<main>`. Use it for page-wide decorative layers that must continue behind the header and footer; raise `main` and the footer above the layer with `z-index`.
- Elements inserted by JavaScript (the `#` button on post headings) have no `data-astro-cid`: keep their styles in `global.css`, not in a scoped `<style>` block.
- The "About me" and "Other projects" sections are hidden entirely when `profile.ts` has no data: do not render an empty block or a placeholder sentence.
- `profile.ts` contains only information approved for public display. As of 2026-10-19: name, role, location, email and GitHub are approved; LinkedIn, CV and avatar are not.
- The home page currently has one known documentation/code deviation (hard-coded decoration counts and timings, allowed only there by ADR 0012). Read the "Known deviations" section in `docs/DESIGN_SYSTEM.md` before changing the home page.

## Definition of "done"

1. The "Check (same as CI)" command above passes. If any command fails, do not report completion: describe the failure and propose a fix.
2. UI changes: check light and dark (currently only Minimalist Editorial) and a mobile viewport.
3. Update documentation in the same change only when relevant:
   - Finished a roadmap item: tick `[x]` in `docs/ROADMAP.md`.
   - Changed directory structure: update "Repository map" here and the tree in `README.md`.
   - Changed a colour token, font or UI rule: update `docs/design/` first, then the code.
   - Settled a memorable decision: add an ADR in `docs/adr/`.
   - Fixed a known deviation: remove it from the "Known deviations" list in `docs/DESIGN_SYSTEM.md`.
4. Do not log every revision round in docs. History lives in commit messages.

## Git

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`. Write the message in English.
- One branch per task, named in English: `feat/<short-description>`, `docs/<short-description>`.
- **Start every task branch from the latest `main`:** run `git switch main && git pull --ff-only`, then
  `git switch -c <branch>`. Do not branch off the current branch or another unmerged branch, even when it
  holds related work. If a task cannot be separated from unmerged work, ask the user first.
- Do not commit directly to `main`.
