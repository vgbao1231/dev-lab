# 0010. Shared tags through the `@dev-lab/tags` package

Status: Accepted
Date: 2026-10-24

## Context

Tags were initially free-form strings in frontmatter. As the number of posts and labs grew, the same
concept was easily written in several variants (`React`, `react`, `ReactJS`, `state`, `state-management`). Tags
also need to be usable in the labs, not only in the portal, and should not depend on a post's `lab`, `type`, or
category.

Approaches considered:

1. Keep using free-form strings, normalised only by a writing convention.
2. Keep a tag list in a portal file and copy it into the labs.
3. Create a shared workspace package.

Approach 1 does not prevent data drift. Approach 2 creates two sources of truth and will drift when tags are added.

## Decision

- Create the package `packages/tags` named `@dev-lab/tags`; the portal and labs declare the dependency
  `workspace:*`.
- The registry has **23 tags**, split into three groups:
  - **Technology:** React, TypeScript, JavaScript, Astro, Next.js, Node.js, Docker, SQL, Git.
  - **Domain:** Frontend, Backend, Performance, Rendering, State Management, Concurrency, Testing,
    Database, DevOps, Cloud.
  - **Approach:** Internals, Architecture, Debugging, Benchmarking.
- Each tag has `id`, `label`, `group`, `description`. `id` is lowercase, unaccented, and uses hyphens
  when needed (`state-management`); `label` keeps the official name (`Next.js`, `Node.js`,
  `State Management`).
- Post frontmatter stores the **id**, not the label. The schema in `portal/src/content.config.ts`:
  - validates ids with `isTagId`;
  - rejects duplicates, fewer than 1, or more than 4 tags;
  - sorts Technology → Domain → Approach and then converts to labels before components read them.
- Content rules: 1–4 tags per post, 2–3 recommended; tags are independent of lab/type/category; prefer
  general tags; check the registry before adding; only add when truly needed.
- Convention doc and full list: [`docs/TAGS.md`](../TAGS.md).

## Consequences

- There is only one source of truth. Adding a tag is a code + docs change, not scattered edits.
- The build fails on a wrong tag instead of silently showing an unknown tag. This is a deliberate choice.
- Tag order in frontmatter no longer affects the UI; the same set of tags always renders in the same order.
- Tags are not a place to record secondary technologies or one-off keywords. Those words belong in post content and
  the search index.
- Changing an `id` that is already in use is a data change and needs a migration; do not change it casually.
