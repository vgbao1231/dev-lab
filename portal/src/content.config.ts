import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { postTypes } from './data/content';

/**
 * Frontmatter chuẩn của bài viết (docs/ROADMAP.md mục 1.4):
 * title, date, type, lab, tags, summary.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(postTypes),
    lab: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    /** draft: true thì bài bị loại khỏi danh sách và không được build. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
