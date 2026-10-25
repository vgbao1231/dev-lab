# Roadmap: Dev Lab

**Current status (2026-10-25):** Phase 1 is still in progress. The portal, design tokens, content system, search, tag registry, covers and the three React articles are implemented. Still open: the deploy work in 1.6, the mobile header sheet, the performance comparison page, and the optional stack-comparison section.

This document splits the project into phases. Each phase has a work checklist and completion criteria.

**Current phase: Phase 1 — Foundation and the first React lab** 🟡 in progress

**Open in phase 1:** 1.3 mobile sheet menu · "Stack comparison" section (paused) ·
1.5 performance comparison page · 1.6 all deploy work.

---

## Phase 1: Foundation and the first React lab 🟡 in progress

**Goal:** A minimal main portal running in production, plus a React lab with at least 3 quality articles.

### 1.1 Repo setup

- [x] Create the `dev-lab` repo
- [x] Write `README.md`, `AGENTS.md`, `docs/`
- [x] Set up the pnpm workspace
- [x] Configure ESLint, Prettier, TypeScript (strict)
- [x] Set up basic CI on GitHub Actions (lint, typecheck, build)

### 1.2 Design tokens

- [x] Create CSS variables for the first theme (Minimalist Editorial), light + dark
- [x] Integrate fonts: Patrick Hand, Inter, JetBrains Mono (with fallbacks and Vietnamese checks)
      — replaced Balsamiq Sans with Patrick Hand because Balsamiq Sans has no Vietnamese subset
- [x] Implement mode switching: dark / light / system
      — theme and mode are two independent axes; the theme picker hides itself when only one theme is available
- [x] Check contrast for text and links in Minimalist Editorial light and dark
      — every token pair meets WCAG AA; secondary text on surface in light is 4.87:1, close to the threshold, so it must not be lowered further
- [x] Add motion tokens (duration, easing) and motion rules — see `docs/DESIGN_SYSTEM.md` section 7

### 1.3 Portal

- [x] Initialise the Astro project in `portal/`
- [x] Shared layout: sticky header, footer, two-level width container (1120px page + 800px text block)
- [x] Home page: hero, lab list, latest articles, other projects, contact
- [x] Lab card component (states: `Đang chạy`, `Sắp tới`, `Dự kiến`)
- [x] Article list page (`/bai-viet`) and article detail page (`/bai-viet/<slug>`)
- [x] "Labs" page listing the labs
- [x] Contact page
- [x] Page transitions with View Transitions (`<ClientRouter />`) + entrance animation for content blocks (`motion/mini`, `data-animate`)
- [x] Apply layout and components from `design-reference/`: sections divided by rules, lab card as link + hover, eyebrow labels
- [x] Standardise hover states (section 7.4 of `DESIGN_SYSTEM.md`): growing underline for links, accent nav pill, article titles, table rows
- [x] Build the responsive foundation: breakpoints 560 / 640 / 768 / 1024, horizontal padding per breakpoint, self-filling lab grid
- [x] Theme/mode picker: two native `<select>` elements on two independent axes; theme hides itself when only one theme exists
- [x] "Back to top" button appears after scrolling 600px, respects `prefers-reduced-motion`
- [x] Header in the style of `ngockhoi96.dev`: sticky, blurred capsule that shrinks on scroll, accent nav pill, hide/show on scroll direction, `transition:persist`
- [x] Header: search button opens a command palette; `Ctrl/Cmd+K` or `/`, searches articles/labs/pages,
      matches without diacritics, keyboard navigation; index generated at build time, no new dependency
- [x] Shared icon set (1.5px stroke, `currentColor`): brand, search, mode, page titles, article
      metadata, footer; replaces scattered characters/emoji
- [x] `/bai-viet`: 1/2/3-column card grid, 16:9 cover, tags, reading time; the home page keeps its
      line-based list
- [ ] Header: mobile sheet menu (not needed in this phase)
- [x] Article detail page: table of contents (TOC) generated from headings, marks the section being read based on scroll position
      — from 1200px it is a separate column stuck below the header so it stays visible; below 1200px it is a block at the top of the article
- [x] Article detail page: `#` button on each heading, shown on hover/focus, click copies a link to the anchor
- [x] Article detail page: reading progress bar at the top edge of the viewport (no percentage shown)
      — where supported it runs on the compositor via `animation-timeline: scroll()`, with no per-frame JS
- [x] Sticky footer: when content is shorter than the viewport the footer still sits at the bottom of the viewport
- [x] Four-column footer (brand · Content · Lab · Contact) + bottom row `© · Mã nguồn · Deploy`
- [x] Home page becomes a portfolio: hero with role + three CTAs, plus an "About me" section (facts table, skills) and "Other projects" from real data
- [x] Home page visual refresh (2026-10-24, [ADR 0012](adr/0012-home-layout-and-parallax.md)): two-column hero, home background/parallax decoration, two-part Labs section, redesigned lab cards
      — current literal values and the missing slogan line are tracked as known deviations in `DESIGN_SYSTEM.md`
- [x] `src/data/profile.ts` as the single source for personal information; empty fields are skipped by the UI
- [ ] "Stack comparison" section on the home page — paused 2026-10-18, to be done together with 1.5 when real measurements exist
- [x] Responsive check on mobile (the breakpoint foundation is already in place)
      — verified 360/390/414px in light and dark: single-row nav, single-column lab grid, TOC at the top of the article, facts chips do not overflow; no horizontal overflow at page level

### 1.4 Content system

- [x] Define the standard frontmatter: `title`, `date`, `type`, `lab`, `tags`, `summary`, `cover`,
      `coverAlt`
- [x] Collection configuration for articles (`portal/src/content.config.ts`: glob loader + zod schema)
- [x] Render tags and metadata in JetBrains Mono
      — the sample `bai-viet-mau.md` was replaced by three real articles in section 1.5
- [x] Shared tag system: `@dev-lab/tags` package (23 tags, 3 groups Technology/Domain/Approach);
      frontmatter stores ids, the schema validates 1–4 tags and maps them to canonical labels; conventions in `docs/TAGS.md`
- [x] Article covers: `cover` + `coverAlt` in frontmatter, inline SVG using theme tokens, monogram
      fallback when the cover is missing

### 1.5 React Lab

- [x] Initialise the React + TypeScript + Vite project in `labs/react-lab/`
- [x] Article 1 (Concept): React Fiber & Reconciliation — element tree, Fiber tree, render phase
      and commit phase; why `key` decides whether state is kept or lost
- [x] Article 2 (Concept): React Concurrent Rendering — lanes, scheduler, interruptible render
      and the limits of the commit phase
- [x] Article 3 (Concept): Tearing & `useSyncExternalStore` — snapshot, subscription and how to
      avoid two components reading two versions of the data
- [ ] Comparison page for bundle size, JS, LCP and build time across labs (data updated as labs are finished)

### 1.6 Deploy

- [ ] Connect the repo to Cloudflare Pages (requires a Cloudflare account — step-by-step configuration in README, section "Deploy")
- [ ] Configure the build for the portal
- [ ] Set up a separate Pages project for React Lab — decided 2026-10-20 with ADR 0008, no subpath
- [ ] Verify branch previews work

### Phase 1 completion criteria

- The portal is reachable in production and renders the Minimalist Editorial theme correctly in both light and dark.
- React Lab has at least 3 articles, each with complete frontmatter.
- Lighthouse Performance on the home page is 90 or above (mobile).
- No WCAG AA contrast failures in main text.
- The README accurately describes how to run locally and the repo structure.

---

## Phase 2: Expand content and interactivity

**Goal:** Add interactive demos and a second lab.

- [ ] Decide how to build interactive demos (island component, iframe, or playground)
- [ ] Add interactive demos to React Lab
- [ ] Pick the second lab (planned: JS Under the Hood or Next.js Lab)
- [ ] Add article filtering by tag (search already exists from phase 1)
- [ ] Add an RSS feed
- [ ] Add a second theme (Digital Garden) — the theme picker will appear on its own once there are two themes

**Completion criteria:** At least 2 labs, one working interactive demo, and readers can find articles by tag.

---

## Phase 3: Ecosystem

**Goal:** Labs run independently with their own processes, and the portal aggregates all of them.

- [ ] Standardise the process for adding a new lab (repo template or guide)
- [ ] Add a third lab following the chosen direction
- [ ] Revisit the ecosystem name and domain structure
- [ ] Update the performance comparison page automatically from CI

**Completion criteria:** Adding a new lab takes no more than a weekend, and the portal updates the lab list on its own.

---

## Deferred work

The following ideas are recorded but not on the roadmap:

- Comments or user interaction
- Multi-language (English, Vietnamese)
- Newsletter subscription system

## Change log

See [`CHANGELOG.md`](CHANGELOG.md). Notable decisions: [`adr/`](adr/README.md).
