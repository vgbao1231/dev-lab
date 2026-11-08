import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isTagId, sortTags, tagIds, type TagId } from '@dev-lab/tags';

import { isCoverId } from './data/covers';

/**
 * Frontmatter for React Lab knowledge pages. Tags use the shared registry so the
 * lab and the portal speak the same language; `topic` and `level` exist only
 * here, because the lab groups its own curriculum.
 */
const tagId = z.custom<TagId>((value) => typeof value === 'string' && isTagId(value), {
  message: `Tag không hợp lệ. Dùng một trong: ${tagIds.join(', ')}`,
});

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/knowledge' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.enum(['concept', 'guide', 'note']),
      topic: z.enum(['hooks', 'lifecycle', 'rendering', 'state', 'performance', 'libraries']),
      level: z.enum(['co-ban', 'trung-cap', 'nang-cao']),
      tags: z
        .array(tagId)
        .min(1, 'Mỗi bài cần ít nhất 1 tag.')
        .max(4, 'Mỗi bài chỉ dùng tối đa 4 tag.')
        .refine((ids) => new Set(ids).size === ids.length, {
          message: 'Tag không được trùng nhau.',
        })
        .transform((ids) => sortTags(ids).map((tag) => tag.label)),
      summary: z.string(),
      cover: z
        .string()
        .refine(isCoverId, {
          message: 'Cover không có trong src/data/covers.ts.',
        })
        .optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt?.trim()), {
      message: 'Bài có cover phải có coverAlt mô tả ảnh.',
      path: ['coverAlt'],
    }),
});

export const collections = { knowledge };
