# Project overview: Dev Lab

## 1. What Dev Lab is

Dev Lab is an ecosystem of technical blogs and labs. Rather than a single blog, the project consists of a **main portal** that introduces, classifies and links to several specialised **labs**. Each lab focuses on one technology or one area — frontend, backend, DevOps or a related topic — and may have its own stack, interface and deployment process.

## 2. Goals

1. **Share knowledge** that has been learned or is being explored.
2. **Reinforce existing knowledge** through research, explanation and practice.
3. **Apply new technology** to small real projects.
4. **Build products worth putting on a CV** if the technical quality is high enough.
5. **Evolve long term**, following the author's career journey.

The project is not meant to produce a novel app idea. The focus is learning value, technical quality and maintainability.

## 3. Audience

- **The author**: a place to take notes, experiment and review.
- **Junior to mid-level frontend developers** who want to understand how React, JavaScript, Next.js and related tools work under the hood.
- **Recruiters or CV reviewers** who want to assess technical ability through real products.

## 4. Scope

### In scope

- A main portal that introduces and lists the labs.
- Content labs: articles, interactive demos, experiments with measurements.
- A contact page, a list of other projects, CV information.

### Out of scope (at least for now)

- Login, comments, user accounts.
- A dedicated backend for content. Content is static files.
- SaaS features, dashboards, or sales landing pages.

## 5. Content types

| Type             | Purpose                                       | Example                              |
| ---------------- | --------------------------------------------- | ------------------------------------ |
| Concept          | Explain knowledge and mechanisms              | How reconciliation works             |
| Experiment       | Experiment, measure, compare                  | useMemo on a list of 10,000 items    |
| Case Study       | Analyse a problem, debug, lessons learned     | Find the cause of excess re-renders  |
| Interactive Demo | A demo the reader can try                     | Simulate the event loop              |
| Tutorial         | Walk through one technique                    | Setting up Vitest with React         |
| Technical Note   | Learning notes, migrations, real-world issues | Building the first lab on Cloudflare |

Not every lab needs to cover all of these types.

## 6. Potential lab examples

This is an open list, not a fixed plan.

| Lab                 | Planned stack               | Main content                              |
| ------------------- | --------------------------- | ----------------------------------------- |
| React Lab           | React, TypeScript, Vite     | Hooks, rendering, state, performance      |
| Next.js Lab         | Next.js                     | SSR, SSG, Server Components, caching      |
| JS Under the Hood   | Flexible                    | Event loop, closure, prototype, Promise   |
| Web Performance Lab | Flexible                    | Core Web Vitals, waterfall, benchmark     |
| Testing Lab         | Vitest, Playwright          | Unit, integration, E2E                    |
| Backend Mechanics   | Node.js, Express            | HTTP, middleware, auth, API design        |
| Database Lab        | SQL                         | Index, join, transaction, isolation level |
| DevOps Playground   | Docker, GitHub Actions      | CI/CD, deployment                         |
| Cloud Lab           | AWS, CloudFront, S3, Lambda | CDN caching, serverless                   |
| Git Internals       | Flexible                    | Commit graph, merge, rebase               |

## 7. Principles

### Dogfooding is optional

Using a technology to build the website itself is a chance to practise, not a requirement. When all that is needed is to explain a concept, writing the article is enough.

### Phased development

Do not build the whole ecosystem at once. Start small and expand when knowledge, needs and time line up. New labs may use different technologies.

### Quality over quantity

One good lab with a few valuable articles is worth more than many labs with no content.

## 8. Criteria for evaluating ideas

When proposing or evaluating a new lab, article or feature, check:

1. Does it serve the goal of sharing knowledge?
2. Does it help reinforce existing knowledge or learn something new?
3. Can it be applied in practice?
4. Is it worth putting on a CV?
5. Can it expand over months or years?
6. Does it have a distinctive character, rather than being just another blog?
7. Are hosting, domain and maintenance costs reasonable?
8. Can it start small and grow gradually?

## 9. Architecture (decided)

Detailed rationale in [`adr/`](adr/README.md).

- **Name**: Dev Lab, repo `dev-lab` (decided 2026-10-18).
- **Portal**: `portal/`, Astro with static output, plain CSS + design tokens ([ADR 0001](adr/0001-astro-static-and-pnpm-workspace.md)).
- **Labs**: each lab is an independent app in `labs/`, and may have its own stack, repo and deploy process. First lab: `react-lab` (React, TypeScript, Vite).
- **Content**: Markdown/MDX in the `posts` content collection; frontmatter schema in `portal/src/content.config.ts`.
- **Design**: theme and mode are two independent axes ([ADR 0002](adr/0002-theme-mode-independent-axes.md)); phase 1 implements only the Minimalist Editorial theme. Tokens and rules in `docs/DESIGN_SYSTEM.md`.
- **Hosting (planned, not connected)**: Cloudflare Pages.
- **Lab placement**: each lab is its own Cloudflare Pages project, built from the same repo, and the portal links to it with absolute URLs ([ADR 0008](adr/0008-one-pages-project-per-lab.md)). Configuration in README, section "Deploy".

## 10. Undecided items

The items below are **not settled yet**. Do not treat them as decided when writing code or content.

- Whether labs share design tokens with the portal or have their own identity (`react-lab` currently only has layout styles).
- Level of interactivity: articles only, with demos, or with a live playground (phase 2).
- The second lab (planned: JS Under the Hood or Next.js Lab).
- The publishing workflow, and whether a content management tool beyond Markdown files is needed.
