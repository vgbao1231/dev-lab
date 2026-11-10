# Active context

A handoff note between working sessions. It answers one question: **what was the previous session
doing, how far did it get, and where did it stop?** It is not a roadmap and not a changelog.

## Rules

- **Rewrite, do not append.** Replace the body with the current state at the end of every session.
  History lives in git, not here.
- **Keep it short.** One screen. If a section no longer applies, delete it.
- **Point, do not duplicate.** Link to the file, ADR or roadmap item instead of restating it.
- **Leave the tree clean or explain it.** List uncommitted and untracked files, and say whether they
  are deliberate.
- **Roadmap items still go to `docs/ROADMAP.md`.** This file only carries the in-between state.

When there is no unfinished work, replace the body with the template at the bottom and a fresh date.

---

## Last updated

2026-11-11 — session: Motion Lab shell hardening, seventh demo, document head and deploy prep.

## Where we are

`main`, after the motion-lab commit from this session. The motion-lab work is committed and pushed;
the only untracked files left are the React Lab demo scaffolding listed under "Background".

## Completed this session

All in `labs/motion-lab/`:

- Not-found hash route, skip link, focus transfer to `<main>` after navigation, per-route title and
  description, playground remount on URL preset change, runtime reduced-motion listener in the
  backdrop, safe card preload. Contract: `docs/DESIGN.md` → "Shell" and "Accessibility".
- Seventh demo `while-in-view` (scroll group, reuses the `scroll` preview kind): `whileInView`,
  `viewport={{ root, once, amount }}`, `onViewportEnter`, a local scroller and a reduced-motion
  state. Snippet added to `src/playground/demoSnippets.ts`.
- Document head: `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og.png` (1200×630),
  theme-color per scheme, canonical/OG/Twitter tags in `index.html`.
- Deploy prep: `public/_headers` (asset caching, `nosniff`, referrer policy) and the before/after
  checklist in `README.md` → "Deploy". `status: 'live'` was corrected to `'running'` there.

## Where it stopped

Only the Cloudflare Pages project is missing. It needs account access, so it cannot be finished from
the repository: no `wrangler` login, no `CLOUDFLARE_API_TOKEN`, and no Pages project exists yet.
Nothing else is blocked.

## Next step

1. Create the Pages project `motion-lab-gura` with the settings in `labs/motion-lab/README.md` (check
   the name is free first). Branch previews off until production works.
2. After the first deploy, set `status: 'running'` and `href` on `motion-lab` in
   `portal/src/data/labs.ts`, update the canonical/OG URL in `index.html` if the domain differs, tick
   the Motion Lab deploy item in `docs/ROADMAP.md` and C2 in `labs/motion-lab/ROADMAP.md`, and add the
   release line to `docs/CHANGELOG.md`.
3. Optionally give the `motion-lab` card a `coverBg` in `portal/src/data/labs.ts` once it is linked.

## Verification state

- Full repo check passes on 2026-11-11: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build`.
- Motion Lab build emits one JS chunk per demo (seven) and copies `public/` assets and `_headers`.
- Browser-checked with Chrome DevTools at 1440px and 390px, light and dark, reduced motion: index,
  `#/demos/while-in-view`, `#/playground`, `#/playground/while-in-view`, not-found route, skip link,
  search dialog, and focus after a card click. No layout overflow seen; the mobile header is two rows.
- Not checked in a real mobile browser or Safari.

## Background (not this session)

- React Lab interactive demos (roadmap 1.5) are still uncommitted and unwired:
  `labs/react-lab/src/data/demos.ts`, `labs/react-lab/src/components/demos/`. Read the previous
  handoff in git history (`docs/ACTIVE_CONTEXT.md` at commit `b3d3ba1`) before resuming; four route
  and registry decisions were still open.
- React Lab's Pages project (1.6) is still open.

---

## Template (copy this body for the next session)

```md
## Last updated

<date> — session: <one line>.

## Where we are

<branch, last commit, working-tree state in one sentence.>

## In progress

<goal + roadmap/ADR link. Files written so far. What is deliberately incomplete.>

## Where it stopped

<technical error, or "not blocked"; what is missing before the work is usable.>

## Decisions needed

<open questions for the human, with options. Delete when empty.>

## Next step

1. <ordered, concrete actions.>

## Verification state

<commands run, their result, and commands still owed.>
```
