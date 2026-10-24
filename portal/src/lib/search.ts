/**
 * Tìm kiếm phía client, không thêm dependency.
 *
 * Chỉ mục được sinh lúc build (`/search-index.json`); phần này chạy ở cả endpoint
 * lẫn trình duyệt nên không được import API của Astro.
 */
export type SearchEntryType = 'post' | 'lab' | 'page';

export type SearchEntry = {
  type: SearchEntryType;
  title: string;
  summary: string;
  href: string;
  meta: string;
  tags: string[];
  /** Chuỗi đã chuẩn hoá, dùng để so khớp nhanh. */
  text: string;
};

export const searchTypeLabels: Record<SearchEntryType, string> = {
  post: 'Bài viết',
  lab: 'Lab',
  page: 'Trang',
};

/**
 * Bỏ dấu tiếng Việt và hạ chữ thường để "fiber" khớp "Fiber", "reconciliation"
 * khớp "reconciliation". `đ` không bị NFD tách nên phải thay riêng.
 */
export const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const scoreEntry = (entry: SearchEntry, query: string, tokens: string[]): number => {
  const title = normalizeSearchText(entry.title);
  const meta = normalizeSearchText(entry.meta);
  const tags = normalizeSearchText(entry.tags.join(' '));
  const summary = normalizeSearchText(entry.summary);

  let score = 0;

  if (title === query) score += 200;
  else if (title.startsWith(query)) score += 120;
  else if (title.includes(query)) score += 80;

  if (tags.includes(query)) score += 45;
  if (meta.includes(query)) score += 35;
  if (summary.includes(query)) score += 25;

  // Nhiều từ khoá rải rác vẫn nên khớp, miễn là tất cả đều có trong mục.
  if (tokens.every((token) => entry.text.includes(token))) score += 15;

  if (score === 0) return 0;

  return score + (entry.type === 'post' ? 3 : entry.type === 'lab' ? 2 : 1);
};

export const searchEntries = (
  entries: readonly SearchEntry[],
  rawQuery: string,
  limit = 8,
): SearchEntry[] => {
  const query = normalizeSearchText(rawQuery);

  if (!query) return entries.slice(0, limit);

  const tokens = query.split(' ').filter(Boolean);

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'vi'))
    .slice(0, limit)
    .map(({ entry }) => entry);
};
