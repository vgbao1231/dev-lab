# Parallel agent workflow

How to run several agents on one feature without them fighting. This is the generic recipe for any
feature in this repo — a new lab, a new demo set, a portal section — not just Motion Lab demos.
`labs/motion-lab/docs/WORKSTREAMS.md` is a worked example of the ownership map this document
describes.

Read this before splitting work. Settle the spec first: every open question must be answered by a
human before agents start, because a dead spec is the main source of rework.

## The shape: three tiers, one gate

```
Tier 0  Foundation     1 agent, runs first, must finish before anything else
                       Contracts, ownership map, shell, types, shared primitives, install once.
Tier 1  Leaf packages  N agents in parallel (N ≤ budget)
                       Each owns a disjoint folder / file set, follows a written spec.
Tier 2  Integration    1 agent, runs last
                       Cross-QA, one full repo check, docs and release.
```

Conflicts come from exactly two places, and this shape removes both:

1. **Two agents touching the same file** → the ownership map gives every file exactly one writer.
2. **Two agents running a repo-wide command** → only the integration agent runs
   `pnpm install`, `pnpm format`, `pnpm build`, `eslint .` or a broad `git add`. Leaf agents verify
   with scoped commands and a private output directory.

## Step 0 — Settle the scope (human, before agents)

Decide and write down: name, scope, stack, status, whether comparison/benchmark is in or out, deploy
model, roadmap slot. Memorable decisions go to `docs/adr/`. The result: zero open questions.

## Step 1 — Tier 0: foundation (one agent)

- Scaffold to the repo's conventions (see `labs/react-lab/` and `labs/motion-lab/`): config files,
  entry point, shell + router, shared types, a self-discovering registry, token/primitive styles,
  `README.md`, a lab `ROADMAP.md`, and `docs/WORKSTREAMS.md` with the ownership map and per-package
  done criteria.
- Install dependencies once so the lockfile is stable; leaf agents never touch `package.json`.
- Run the full check once: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build`.
- Ship a green skeleton where leaf packages can be added without breaking the build.

## Step 2 — Tier 1: leaf packages (parallel)

- Split by **disjoint ownership**: one folder or one file set per package. Two packages never share
  a path.
- Each package gets a written spec: done criteria, the APIs/interfaces it must use, verify commands,
  a fixed dev port, and the commit message.
- **Prompts must be self-contained.** A subagent starts with an empty context: its prompt carries the
  contract path, the owned paths, the spec, the verify commands, the port and the commit line. Never
  let a subagent infer an interface.
- Leaf rules: no shared-file edits, no repo-wide commands, no new dependencies, no
  merge/rebase/branch changes, no `git add -A`. If a package needs a shared primitive or a config
  change, it stops and asks the owner of that file.
- **Isolation strategy by size.** With ≤ 3–4 leaf packages, one shared working tree plus the
  ownership map is enough — no merges needed. From 4–5 packages, give each agent its own git
  worktree (`tools.opencode.worktree_create` + `session_move`) so commits, `dist/` and dev servers
  never touch another agent; merge back to the feature branch when the package lands.
- **Budget, not enthusiasm.** One agent = one prompt + fix rounds. Split by cost: cheap models for
  leaf packages that follow a spec, a strong model for the integration gate. Cap parallel agents to
  what the account supports; 2–3 in parallel is safer than 6, because an agent that dies mid-way
  (out of balance) stalls the whole batch. Max one level of spawning: coordinator → leaf.

## Step 3 — Tier 2: integration (one agent, runs last)

- Cross-QA: spec matches the code, each unit ships as its own chunk, responsive at 390px/1280px,
  light and dark, reduced motion, keyboard.
- Fixes: a defect inside a package goes back to that package; a small defect in a shared file is
  fixed by the integration agent.
- Run the full check once, from the repo root.
- Docs/release: status and link in `portal/src/data/labs.ts`, deploy table in the root `README.md`,
  roadmap ticks, `docs/CHANGELOG.md`, repo map in `AGENTS.md`, ADR when a decision is memorable.

## Step 4 — Human steps

- Create the Cloudflare Pages project (fixed name, root directory `/`, build
  `pnpm --filter <pkg> build`, output `labs/<name>/dist`, env `NODE_VERSION` + `PNPM_VERSION`).
- Push the branch, open a PR if needed, confirm the production deploy, then set the real `href` in
  `labs.ts`. Until there is a real URL, keep `status: planned` and leave a note.

## Step 5 — Close the loop

Delete old branches, update the open lab list in `docs/PROJECT_OVERVIEW.md`, keep the
`AGENTS.md` repository map accurate.

## Checklist before each parallel batch

- [ ] Spec settled, zero open questions.
- [ ] Ownership map final: one writer per file, no shared paths between packages.
- [ ] Tier 0 green and committed; leaf packages cannot break the build.
- [ ] Each package: done criteria, verify command, fixed port, commit message in the prompt.
- [ ] Prompts self-contained (no subagent has to guess).
- [ ] Only the integration agent runs repo-wide commands; leaves use `--outDir /tmp/<pkg>` and
      `--port <n>`.
- [ ] Parallel count within budget; cheap model for leaves, strong model for integration.
- [ ] End: one merge target, one full check, then docs/release.

## Anti-patterns

- Starting agents on an unsettled spec.
- Letting a leaf agent edit a shared file "just this once".
- More than one agent running `pnpm install` / `pnpm build` / `pnpm format` / `eslint .`.
- Deep subagent trees that make the budget uncontrollable.
- `git add -A` or repo-wide commits from a leaf package.
- Reporting "done" without one full `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build`.
