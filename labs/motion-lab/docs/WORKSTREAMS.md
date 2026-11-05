# Motion Lab work packages

How to split Motion Lab work across several agents without them fighting over files. Read
[`../ROADMAP.md`](../ROADMAP.md) for the plan; this file is the contract. The generic recipe for any
feature lives in [`../../docs/PARALLEL_AGENTS.md`](../../docs/PARALLEL_AGENTS.md).

## Ownership map

| Package | Owns (write)                                                                                                                                                                                                                                                              | Reads (never edits)                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **A**   | `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/components/`, `src/lib/`, `src/demos/types.ts`, `src/demos/registry.ts`, `src/demos/DemoBoundary.tsx`, `vite.config.ts`, `tsconfig.json`, `package.json`, `index.html`, `README.md`, `ROADMAP.md`, `docs/DESIGN.md` | —                                              |
| **B1**  | `src/demos/variants/`                                                                                                                                                                                                                                                     | everything in A; `src/demos/types.ts`          |
| **B2**  | `src/demos/gestures/`                                                                                                                                                                                                                                                     | same                                           |
| **B3**  | `src/demos/layout/`                                                                                                                                                                                                                                                       | same                                           |
| **B4**  | `src/demos/scroll/`                                                                                                                                                                                                                                                       | same                                           |
| **B5**  | `src/demos/springs/`                                                                                                                                                                                                                                                      | same                                           |
| **B6**  | `src/demos/reduced-motion/`                                                                                                                                                                                                                                               | same                                           |
| **C1**  | `portal/src/content/posts/motion-*.mdx` (new files), `packages/tags/src/index.ts`, `docs/TAGS.md`                                                                                                                                                                         | `portal/src/content.config.ts`, `docs/design/` |
| **C2**  | `README.md` (root), `portal/src/data/labs.ts`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, this lab's `README.md`                                                                                                                                                             | everything else                                |

Rules that make this safe:

1. **A file has exactly one writer.** If your package needs a change outside its column, stop and ask
   the coordinator; do not edit it "just this once".
2. **Never edit the registry to add a demo.** `src/demos/registry.ts` discovers folders with
   `import.meta.glob`. Adding `src/demos/<id>/meta.ts` + `index.tsx` is all it takes.
3. **Never add dependencies.** `motion`, `react`, `react-dom` are already installed. If a demo truly
   needs a package, propose it; do not run `pnpm add` or commit `pnpm-lock.yaml`.
4. **Do not run repo-wide commands** (`pnpm install`, `pnpm format`, `pnpm build`, `eslint .`) while
   others work: they rewrite files outside your package and can clobber another agent's edit.
5. **Do not merge, rebase or switch branches.** Everything lands on `feat/motion-lab` (git push is
   unavailable in this environment; the maintainer pushes).

## Per-demo package (B1–B6)

You write three files inside your folder (the metadata file already exists, refine it if the demo
diverges from the spec):

```
src/demos/<id>/meta.ts     DemoMeta: id, title, group, order, summary, preview, api, pitfalls, code
src/demos/<id>/index.tsx   export default function <Name>Demo() { … }
src/demos/<id>/styles.css  <id>-prefixed classes; import it from index.tsx
```

`index.tsx` skeleton:

```tsx
import { motion } from 'motion/react';
import './styles.css';

export default function VariantsDemo() {
  return (
    <motion.div className="variants-grid" animate={{ opacity: 1 }}>
      …
    </motion.div>
  );
}
```

Requirements:

- Import motion APIs from `motion/react` only.
- One interaction the reader controls. If it cannot be operated without a mouse, it is not done.
- `meta.code` is the short snippet shown under the demo. Keep it readable (≤ 12 lines) and in sync
  with the real code; no comments inside it.
- `meta.preview` picks one of the shared card kinds (`spring`, `stagger`, `gesture`, `layout`,
  `scroll`, `reduce`). Reuse an existing kind; a new kind belongs to package A and is documented in
  `docs/DESIGN.md` first.
- The demo must not import from `App.tsx`, `registry.ts`, another demo, or `DemoBoundary`; the shell
  wraps it already.
- Reuse the shared primitives (`demo-row`, `demo-button`, `demo-hint`, `demo-output`, `chip`,
  `code-block`). Need another shared primitive? Ask; do not edit `src/styles.css`.
- Style with the lab's CSS variables (`--lab-surface`, `--lab-border`, `--lab-accent`, spacing and
  type tokens in `src/styles.css`). No hard-coded hex colours, no gradients, no glow.
- Respect reduced motion by reading `useReducedMotion()` from `motion/react` (the CSS guard alone
  only covers transitions).
- Keep it inside the demo stage: no fixed positioning, no window-level listeners without cleanup, no
  layout that assumes more than ~18rem of height.

### Verify your package

```bash
pnpm exec prettier --write labs/motion-lab/src/demos/<id>
pnpm exec prettier --check labs/motion-lab/src/demos/<id>
pnpm exec eslint labs/motion-lab/src/demos/<id>
pnpm --filter motion-lab typecheck
pnpm --filter motion-lab dev --port <assigned port>
```

Open `http://localhost:<port>/#/demos/<id>`, then check 390px and 1280px, light and dark, and
`prefers-reduced-motion: reduce` (Firefox: `about:config` → `ui.prefersReducedMotion=1`, or devtools →
Accessibility → "Emulate"). Do not run a production build per agent: use a private output directory
if you must (`pnpm --filter motion-lab exec vite build --outDir /tmp/motion-lab-<id>`), because the
shared `dist/` is written by the integration step.

| Package           | Port |
| ----------------- | ---- |
| B1 variants       | 5211 |
| B2 gestures       | 5212 |
| B3 layout         | 5213 |
| B4 scroll         | 5214 |
| B5 springs        | 5215 |
| B6 reduced motion | 5216 |

### Commit

```bash
git add labs/motion-lab/src/demos/<id>
git commit -m "feat(motion-lab): add <id> demo"
```

Only stage your folder. Never `git add -A` or `git add .`; other agents have uncommitted work in the
same working tree.

## C1 — content package

Owns new portal articles and the tag registry only.

- Add a `motion` tag to `packages/tags/src/index.ts` (technology group) and the matching row/notes in
  `docs/TAGS.md`.
- Write `portal/src/content/posts/motion-<slug>.mdx` in Vietnamese; frontmatter needs `title`,
  `date`, `type` (`tutorial`/`concept`), `lab: motion-lab`, 1–4 tag IDs, `summary`. Skip `cover` unless
  a cover entry already exists in `src/data/covers.ts` — that file belongs to C2.
- Link to the demo (`https://<lab-url>/#/demos/<id>` only after C2 deploys; until then link by demo
  name and leave the URL out).
- Verify: `pnpm --filter portal build` (Astro validates frontmatter).

Do not change `portal/src/data/labs.ts`, the portal roadmap or the portal design docs: C2 owns them.

## C2 — release package (runs last)

Starts only when B1–B6 and C1 are merged on `feat/motion-lab`.

1. Deploy the lab as a separate Cloudflare Pages project (`pnpm --filter motion-lab build`, output
   `labs/motion-lab/dist`, root directory `/`, env `NODE_VERSION` + `PNPM_VERSION` as in the root
   `README.md`). Branch previews stay off until the first production deploy works.
2. Add the Motion Lab row to the deploy table in the root `README.md` and the project tree if needed.
3. Set `status: 'running'` and `href` on the `motion-lab` entry in `portal/src/data/labs.ts`.
4. Tick the completed Phase 2 boxes in `docs/ROADMAP.md` and add one `docs/CHANGELOG.md` entry.
5. Update this lab's `README.md` status section; keep the ownership map in this file accurate.
6. Run the full check from the repo root: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build`.

## Adding a seventh demo later

Create `src/demos/<id>/meta.ts` (unique `order`, group from `src/demos/types.ts`), `index.tsx` and
`styles.css`. No registry edit, no shell edit: the index page and the hash route pick it up on the
next dev-server reload. If a new group is needed, ask package A — group labels live in
`registry.ts`.

## Scaling to N agents

Run this only after the foundation (package A) is green and the ownership map is final. Rules that
keep N agents from stepping on each other:

1. **Three tiers, one gate.** Foundation (1 agent) → leaf packages (N agents, parallel) →
   integration (1 agent). Only the integration agent runs repo-wide commands
   (`pnpm install`, `pnpm format`, `pnpm build`, `eslint .`, full `git add`). Leaf agents verify
   with filtered commands and a private output directory
   (`pnpm --filter motion-lab exec vite build --outDir /tmp/<pkg>`).
2. **Pick the isolation strategy by size.** With ≤ 3–4 leaf packages, one shared working tree plus
   the ownership map is enough (no merges needed). From 4–5 packages, give each agent its own git
   worktree (`tools.opencode.worktree_create` + `session_move`) so commits, `dist/` and dev servers
   never touch another agent; merge back to the feature branch when the package lands.
3. **Self-contained prompts.** A subagent starts with an empty context: its prompt must carry the
   contract path, the exact owned paths, done criteria, verify commands, the fixed dev port and the
   commit message. Never make a subagent infer an interface.
4. **Budget, not enthusiasm.** One agent = prompt + fix rounds. Split by cost: cheap models for
   leaf packages that follow a spec, a strong model for the integration gate. Cap parallel agents to
   what the balance supports; 2–3 in parallel is safer than 6, because a dead agent mid-way (out of
   balance) stalls the whole batch. One level of spawning max: coordinator → leaf, no deep trees.
5. **Shared files have one writer.** A new shared primitive, group or config change goes through the
   package that owns that file (usually the foundation or the integration agent). A leaf agent that
   needs one stops and asks instead of editing "just this once".

The 3-tier + 1-gate shape is the generic recipe for any feature in this repo, not just Motion Lab
demos: settle the spec first, split by disjoint ownership, integrate once.
