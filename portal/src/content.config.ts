import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isTagId, sortTags, tagIds, type TagId } from '@dev-lab/tags';

import { postTypes } from './data/content';
import { isCoverId } from './data/covers';

/**
 * Frontmatter chuẩn của bài viết (docs/ROADMAP.md mục 1.4):
 * title, date, type, lab, tags, summary, cover, coverAlt.
 *
 * `tags` lưu id trong registry `@dev-lab/tags`; schema đổi id thành label chuẩn
 * trước khi component đọc, nên UI không phải biết tới id.
 */
const tagId = z.custom<TagId>((value) => typeof value === 'string' && isTagId(value), {
  message: `Tag không hợp lệ. Dùng một trong: ${tagIds.join(', ')}`,
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.enum(postTypes),
      lab: z.string(),
      tags: z
        .array(tagId)
        .min(1, 'Mỗi bài cần ít nhất 1 tag.')
        .max(4, 'Mỗi bài chỉ dùng tối đa 4 tag.')
        .refine((ids) => new Set(ids).size === ids.length, {
          message: 'Tag không được trùng nhau.',
        })
        .transform((ids) => sortTags(ids).map((tag) => tag.label)),
      summary: z.string(),
      /** Khóa cover trong `src/data/covers.ts`; không bắt buộc để bài cũ vẫn build. */
      cover: z
        .string()
        .refine(isCoverId, {
          message: 'Cover không có trong src/data/covers.ts.',
        })
        .optional(),
      /** Mô tả ảnh cho screen reader; bắt buộc khi có cover. */
      coverAlt: z.string().optional(),
      /** draft: true thì bài bị loại khỏi danh sách và không được build. */
      draft: z.boolean().default(false),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt?.trim()), {
      message: 'Bài có cover phải có coverAlt mô tả ảnh.',
      path: ['coverAlt'],
    }),
});

export const collections = { posts };
