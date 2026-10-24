import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { postTypeLabels } from '../data/content';
import { labStatusLabel, labs } from '../data/labs';
import { normalizeSearchText, type SearchEntry, type SearchEntryType } from '../lib/search';

export const prerender = true;

const entry = (
  type: SearchEntryType,
  title: string,
  summary: string,
  href: string,
  meta: string,
  tags: string[] = [],
): SearchEntry => ({
  type,
  title,
  summary,
  href,
  meta,
  tags,
  text: normalizeSearchText([title, summary, href, meta, ...tags].join(' ')),
});

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const entries: SearchEntry[] = [
    ...posts.map((post) =>
      entry(
        'post',
        post.data.title,
        post.data.summary,
        `/bai-viet/${post.id}`,
        `${postTypeLabels[post.data.type]} · ${post.data.lab}`,
        post.data.tags,
      ),
    ),
    ...labs.map((lab) =>
      entry(
        'lab',
        lab.name,
        lab.summary,
        lab.href ?? '/labs',
        labStatusLabel[lab.status],
        lab.stack,
      ),
    ),
    entry('page', 'Trang chủ', 'Giới thiệu Dev Lab, lab và bài viết mới.', '/', 'Trang'),
    entry('page', 'Bài viết', 'Tất cả bài viết kỹ thuật của Dev Lab.', '/bai-viet', 'Trang'),
    entry('page', 'Labs', 'Danh sách các lab kỹ thuật của Dev Lab.', '/labs', 'Trang'),
    entry('page', 'Liên hệ', 'Thông tin liên hệ với tác giả Dev Lab.', '/lien-he', 'Trang'),
  ];

  return new Response(JSON.stringify(entries), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
