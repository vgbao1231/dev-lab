# Architecture Decision Records (ADR)

These files record the **main** decisions for the portal and for how the ecosystem is put together:
the context, the decision, and the trade-offs. Use them to answer "why was it done this way" without
digging through commit history.

**Scope:** ADRs are about the portal (`portal/`) and how labs are hosted. Each lab is an independent app
with its own stack, design and rules; lab-internal decisions belong in that lab's own `README.md` /
`AGENTS.md`, not here. The portal's design system and ADRs are not requirements for a lab.

Conventions:

- One file per **area**, not per small change, to keep the context an agent has to read small. File name
  `NNNN-short-name.md`, numbered in ascending order.
- Current values and UI rules live in `docs/design/`; ADRs keep only the reasoning.
- Do not rewrite the rationale of an old decision. If a decision changes, add a dated
  `## Implementation note (YYYY-MM-DD)` section or a new ADR that supersedes it.

Template:

```md
# NNNN. Decision title

Status: Accepted | Superseded by NNNN
Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

## List

| ADR                                  | Decision                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| [0001](0001-portal-architecture.md)  | Static Astro portal in a pnpm workspace; each lab is its own Pages project      |
| [0002](0002-design-foundations.md)   | Theme × mode axes, typography rules and token usage                             |
| [0003](0003-portal-ui-and-motion.md) | View Transitions, sticky capsule header, reading progress, home-page decoration |
| [0004](0004-content-and-search.md)   | Post covers, shared tag registry and the build-time search index                |

On 2026-11-04 the first twelve ADRs were merged into these four areas so an agent does not have to read
twelve files for the same context. The original wording is still in git history and in
[`CHANGELOG.md`](../CHANGELOG.md) where a change was notable.
