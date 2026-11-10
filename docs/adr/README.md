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

| ADR                                  | Decision                                                                        | Context load |
| ------------------------------------ | ------------------------------------------------------------------------------- | ------------ |
| [0001](0001-portal-architecture.md)  | Static Astro portal in a pnpm workspace; each lab is its own Pages project      | `full`       |
| [0002](0002-design-foundations.md)   | Theme × mode axes, typography rules and token usage                             | `full`       |
| [0003](0003-portal-ui-and-motion.md) | View Transitions, sticky capsule header, reading progress, home-page decoration | `full`       |
| [0004](0004-content-and-search.md)   | Post covers, shared tag registry and the build-time search index                | `full`       |

### Context load

How much of an ADR an agent has to read before working in that area. This is separate from the
`Status:` line inside each file, which stays the source of truth for the decision's lifecycle.

- `full` — read the whole file. The reasoning still stops someone from repeating a mistake.
- `summary` — the one-line decision in this table is enough to act correctly; open the file only to
  understand history.
- `skip` — superseded, obsolete or no longer true. Follow the successor ADR instead.

Rules:

- A new ADR starts at `full`.
- Downgrade to `summary` only when the decision's current rules live somewhere else (mostly
  `docs/design/` or the code) and the ADR no longer carries a warning worth reading in full.
- Never downgrade while the ADR holds a rule that has no other home, or an open
  `## Implementation note` section.
- Review this column when a phase closes in [`ROADMAP.md`](../ROADMAP.md), or when an ADR is
  superseded. That is the moment the detail has usually moved into the specs, so the reasoning can
  compress.

On 2026-11-04 the first twelve ADRs were merged into these four areas so an agent does not have to read
twelve files for the same context. The original wording is still in git history and in
[`CHANGELOG.md`](../CHANGELOG.md) where a change was notable.
