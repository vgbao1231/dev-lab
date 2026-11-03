# 0004. Content system: covers, shared tags and search

Status: Accepted
Date: 2026-10-24 (merged 2026-11-04)

## Context

`/bai-viet` became a card grid and needs a visual per post, without changing the home-page list. Covers
could come from the first image in the body, a raster image optimised with `astro:assets`, or an assigned
SVG key. The first approach makes content depend on images and produces accidental covers; the second
needs two image sets for light/dark and depends on the image pipeline.

Tags started as free-form strings, so the same concept appeared as `React`, `react`, `ReactJS`, `state`
and `state-management`. They also need to work in labs, not only in the portal.

Search needed a command palette over posts, labs and pages, on a static site with no backend and little
JavaScript. Options were an external service, a client-side search library, or a JSON index built with
the site.

## Decision

### Covers

- Frontmatter has `cover` (a key in `portal/src/data/covers.ts`) and `coverAlt` (required when a cover
  exists). Arbitrary paths are not allowed.
- The cover is a hand-drawn SVG in `portal/src/assets/covers/`, embedded inline via
  `import.meta.glob(..., { query: '?raw' })` so it can use token custom properties and follow theme × mode.
- `PostCover.astro` is the only renderer. Without a cover it draws a monogram fallback (up to two
  initials) with no fake alt and no link. Covers use a 16:9 ratio and appear only on `/bai-viet`.

### Tags

- `packages/tags` (`@dev-lab/tags`) is the single registry, consumed with `workspace:*`.
- Each tag has `id`, `label`, `group` and `description`; ids are lowercase and unaccented, labels keep
  the official spelling.
- Frontmatter stores ids. The schema validates them, rejects duplicates and counts outside 1–4, sorts
  Technology → Domain → Approach, then converts to labels before components read them.
- Conventions and the full list: `docs/TAGS.md`.

### Search

- A command palette built on a native `<dialog>` + `showModal()`; no hand-rolled modal.
- `/search-index.json` is generated at build time from the content collection, `labs.ts` and static
  pages; the client fetches it lazily on first open and caches it in memory.
- Normalisation is NFD + strip combining marks + `đ` → `d` + lowercase + collapse whitespace, so
  `fiber` matches `Fiber`.
- Ranking is plain TypeScript in `portal/src/lib/search.ts` (title > tags > meta > summary > all tokens,
  slight preference posts → labs → pages, at most 8 results), shared by the endpoint and the client.
- `Ctrl/Cmd+K` and `/` open it; `↑`/`↓`, `Enter`, `Esc` work as expected. Results are real links.

## Consequences

- Covers are correct in light/dark with no JavaScript, no second image set and no image optimisation;
  the build fails on a bad cover key or a missing `coverAlt`.
- There is one source of truth for tags, and a wrong tag fails the build instead of rendering an
  unknown label.
- Search costs nothing to host, needs no API key, and the index is a few KB. Ranking is good enough for
  a few dozen entries; revisit if the content grows to thousands.
- Search depends on JavaScript; `/bai-viet` remains the complete way to browse when JS fails.
- A new content type must be added to the search endpoint and the `SearchEntry` type.
- Tags are not a place for secondary technologies or one-off keywords; those belong in post content.
