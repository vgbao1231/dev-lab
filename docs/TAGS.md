# Tag system

Tags are shared metadata for the portal and every lab. The goal is that an article can be found
using the same vocabulary regardless of which lab, content type or category it belongs to.

The registry lives in **`packages/tags/src/index.ts`** and is published internally as
**`@dev-lab/tags`**. The portal and the labs import from the same source; do not copy the tag list anywhere else.

## Rules for choosing tags

- Each article uses **1–4 tags**, **2–3** recommended. A tag should only be present when it genuinely helps
  classify or find the article.
- Tags are **independent** of `lab`, `type` and category. Do not use tags as a substitute for the lab name, article type or
  section.
- Use the **official English name** of the technology/concept: `Next.js`, `Node.js`, `State
Management`, not `Nextjs`, `Node`, `state`.
- Prefer **general, reusable** tags. Do not create a tag for a single article, a small library or
  a variant that appears only once.
- **Check the list before adding.** If a tag with the same meaning already exists, use it. For example: do not add
  `hooks` when `React` exists; do not add `async` when `Concurrency` exists.
- Do not use tags in place of keywords in the title. Specific keywords (API names, error names) belong to the
  article body and the search index, not the registry.
- Display order is decided by the registry: **Technology → Domain → Approach**, and within a group by
  label. Frontmatter does not need to be sorted.

## Current list (23 tags)

### Technology — tools, languages, platforms

| ID           | Label      | Use when                                              |
| ------------ | ---------- | ----------------------------------------------------- |
| `react`      | React      | React, hooks, rendering and the related ecosystem     |
| `typescript` | TypeScript | Type system, generics, strict mode and tooling        |
| `javascript` | JavaScript | The JavaScript language, its runtime and mechanics    |
| `astro`      | Astro      | Astro, islands, content collections and static builds |
| `nextjs`     | Next.js    | Next.js, SSR/SSG, Server Components and caching       |
| `nodejs`     | Node.js    | Node.js runtime, HTTP, middleware and APIs            |
| `docker`     | Docker     | Containers, images, compose and runtime environments  |
| `sql`        | SQL        | Queries, indexes, joins and transactions              |
| `git`        | Git        | Commit graph, merge, rebase and workflow              |

### Domain — technical areas or concepts

| ID                 | Label            | Use when                                                      |
| ------------------ | ---------------- | ------------------------------------------------------------- |
| `frontend`         | Frontend         | Building client-side interfaces and experiences               |
| `backend`          | Backend          | APIs, services and server-side processing                     |
| `performance`      | Performance      | Load speed, runtime cost and performance metrics              |
| `rendering`        | Rendering        | How the UI is created/updated: render, reconciliation, commit |
| `state-management` | State Management | Managing, sharing and syncing state                           |
| `concurrency`      | Concurrency      | Scheduling, interrupts, parallel work and consistency         |
| `testing`          | Testing          | Unit, integration, E2E and testing strategy                   |
| `database`         | Database         | Data models, queries, transactions and isolation              |
| `devops`           | DevOps           | Builds, deploys, CI/CD and running systems                    |
| `cloud`            | Cloud            | CDNs, serverless and cloud infrastructure                     |

### Approach — the article's angle

| ID             | Label        | Use when                                            |
| -------------- | ------------ | --------------------------------------------------- |
| `internals`    | Internals    | Going into the internals of a runtime or framework  |
| `architecture` | Architecture | System structure, boundaries and design trade-offs  |
| `debugging`    | Debugging    | Finding the cause of bugs and observing systems     |
| `benchmarking` | Benchmarking | Controlled, reproducible measurement and comparison |

## Using tags in articles

Frontmatter stores the **ID**, not the label:

```yaml
tags: ['react', 'internals', 'rendering']
```

The schema in `portal/src/content.config.ts` will:

1. Check that each ID exists in the registry.
2. Reject duplicate tags, fewer than 1 or more than 4.
3. Sort by group and then map IDs to canonical labels.

Components only receive labels (`React`, `Internals`, `Rendering`), so the UI does not need to know the registry and
cannot accidentally display raw IDs. A wrong tag in frontmatter makes the **build fail** rather than being
silently ignored.

Example:

| Article                          | Tags                                       |
| -------------------------------- | ------------------------------------------ |
| React Fiber & Reconciliation     | `react`, `internals`, `rendering`          |
| React Concurrent Rendering       | `react`, `concurrency`, `performance`      |
| Tearing & `useSyncExternalStore` | `react`, `state-management`, `concurrency` |

## When a new tag is needed

Only add one when truly necessary, and do it in the same change:

1. Check the tables above and the existing tags; rule out any with the same meaning.
2. Propose the ID, label, group and a one-sentence description of the scope.
3. Update `packages/tags/src/index.ts` and this document.
4. Run `pnpm typecheck`; the portal schema picks up the new list automatically.
5. Do not change an existing ID that articles already use; changing an ID is a data change and needs its own migration.

Tags are not a place to record secondary technologies, small library names or personal preferences. If a tag is used
only by one article and does not help find other articles, leave that word in the article body.
