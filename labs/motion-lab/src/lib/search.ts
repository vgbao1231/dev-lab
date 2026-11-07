/**
 * Client-side search for the lab shell. There is no build step and no separate
 * index file: the demos are already imported eagerly as metadata, so the index
 * can be built in memory.
 *
 * The normalisation and scoring follow the portal's search on purpose, so a
 * reader gets the same behaviour on both sites: accents are ignored, `đ` maps to
 * `d`, and a title match outweighs a summary match.
 */
export type LabSearchEntry = {
  id: string;
  title: string;
  /** Short badge: the demo group, or "Trang" for a page entry. */
  type: string;
  /** Secondary line: the APIs or the page context. */
  meta: string;
  summary: string;
  href: string;
  /** Normalised haystack, built once when the module loads. */
  text: string;
};

export const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const scoreEntry = (entry: LabSearchEntry, query: string, tokens: string[]): number => {
  const title = normalizeSearchText(entry.title);
  const meta = normalizeSearchText(entry.meta);
  const summary = normalizeSearchText(entry.summary);

  let score = 0;

  if (title === query) score += 200;
  else if (title.startsWith(query)) score += 120;
  else if (title.includes(query)) score += 80;

  if (meta.includes(query)) score += 45;
  if (summary.includes(query)) score += 25;

  // Scattered tokens should still match when every token appears somewhere.
  if (tokens.every((token) => entry.text.includes(token))) score += 15;

  return score;
};

/** Returns the best matches, or the first entries when the query is empty. */
export const searchLabEntries = (
  entries: readonly LabSearchEntry[],
  rawQuery: string,
  limit = 8,
): LabSearchEntry[] => {
  const query = normalizeSearchText(rawQuery);

  if (!query) {
    return entries.slice(0, limit);
  }

  const tokens = query.split(' ').filter(Boolean);

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'vi'))
    .slice(0, limit)
    .map(({ entry }) => entry);
};
