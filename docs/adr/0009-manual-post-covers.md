# 0009. Post covers are assigned manually, inline SVG per theme

Status: Accepted
Date: 2026-10-24

## Context

The `/bai-viet` page moved to a card grid and needs a visual for each post. The home page already has
its final design for the `Bài viết mới` section (a row list, no thumbnails), so covers are only used
on the archive page and must not bring along home page layout changes.

There are three approaches:

1. Use the first image in the post body as the cover.
2. Use a raster image placed in `public/` or `src/assets/`, optimised with `astro:assets`.
3. Assign a cover key in frontmatter that resolves to an in-house SVG.

Approach 1 makes post content depend on images and easily produces unintended covers. Approach 2
needs two image sets for light/dark if the image is to blend with the theme, and it depends on the
image optimisation pipeline.

## Decision

- Frontmatter has two fields:
  - `cover`: a key in `portal/src/data/covers.ts`, for example `react-fiber`.
  - `coverAlt`: the image description for screen readers; **required** when `cover` is present.
- The image is a hand-drawn SVG in `portal/src/assets/covers/`, embedded **inline** with
  `import.meta.glob(..., { query: '?raw', import: 'default' })`. This lets the SVG use CSS custom
  properties (`--color-surface`, `--color-accent`, …) and follow the theme/mode automatically.
- `PostCover.astro` is the only place that renders a cover. If a post has no `cover`, the component
  renders a monogram fallback from the first letter of the title; the fallback does not create a fake
  alt and is not a link.
- Covers use a 16:9 ratio, at the top of the card; images in the post body are not used as covers.
- Adding a cover is a deliberate change: add the SVG file, add the key to `covers.ts`, and use it in
  frontmatter. Arbitrary paths in frontmatter are not allowed.

## Consequences

- Covers are correct in light/dark automatically, with no JavaScript and no two image sets.
- The build can validate the cover key and `coverAlt`; a frontmatter error fails the build instead of
  showing a broken image.
- There is no automatic image optimisation (resize/AVIF/WebP). This is acceptable because covers are
  small SVGs with few colours, embedded once in the HTML.
- Authors must describe `coverAlt` themselves; alt text cannot be derived from the SVG content.
- The home page keeps `PostList` unchanged; covers only appear in `PostCard` on `/bai-viet`.
