# 0011. Search command palette, index generated at build time

Status: Accepted
Date: 2026-10-24

## Context

The portal is a static Astro site. It needs search over posts, labs, and static pages with a command
palette experience similar to `ngockhoi96.dev`: open quickly from the keyboard, match without
diacritics, navigate with arrow keys. The site currently has no backend and prioritises little JavaScript.

Approaches:

1. An external search service (Algolia, Typesense).
2. A client-side search library (Fuse.js, MiniSearch, Pagefind).
3. Generate a JSON index at build time and rank on the client.

Approach 1 adds a service dependency, cost, and configuration outside the repo. Approach 2 is feasible
but adds a runtime dependency or a separate build step for a very small dataset (a few dozen entries).

## Decision

- Use a search command palette as a native `<dialog>` + `showModal()`; do not build a hand-rolled modal.
- The index is generated at build time at `/search-index.json` from the content collection, `labs.ts`,
  and the list of static pages. Each entry has `type`, `title`, `summary`, `href`, `meta`, `tags`, and a
  normalised `text`.
- The client fetches the index **lazily** on first open and caches it in memory. No external API calls.
- Search normalisation: NFD, strip combining marks, map `đ` → `d`, lowercase, collapse whitespace. Thus
  `fiber` matches `Fiber`, and `reconciliation` matches `Reconciliation`.
- Simple ranking with no library dependency: title match > tags > metadata > summary > all
  tokens; a slight preference for posts, then labs, then pages. At most 8 results.
- Keyboard shortcuts: `Ctrl/Cmd+K` and `/` when focus is not inside input/textarea/select/contenteditable.
  Inside the dialog: `↑`/`↓` change the item, `Enter` opens, `Esc` closes; clicking outside the panel also closes it.
- No runtime dependency added. The search code is plain TypeScript in `portal/src/lib/search.ts` so the
  endpoint and the client share it.
- Results are real links (`<a href>`), not a `button` + `router.push`; this keeps open-in-new-tab,
  link copying, and View Transitions working.

## Consequences

- No service cost, no API key, and the index sits in the static bundle at a few KB.
- Ranking quality is good enough for a few dozen entries; if content grows to thousands of entries it needs
  re-evaluation (Pagefind or an index with stemming could replace it).
- Search depends on JavaScript. There is no server-side fallback; the `/bai-viet` page remains the complete way
  to browse when JS fails.
- The index only contains public content; `draft` posts are excluded.
- When adding a new content type, it must be added to the endpoint and the `SearchEntry` type; this is a known
  maintenance point.
