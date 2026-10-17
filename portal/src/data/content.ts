/**
 * Quy ước nội dung dùng chung cho bài viết (xem docs/ROADMAP.md mục 1.4).
 * `type` phải nằm trong danh sách này; schema của collection kiểm tra bằng `postTypes`.
 */
export const postTypes = [
  'concept',
  'experiment',
  'case-study',
  'demo',
  'tutorial',
  'note',
] as const;

export type PostType = (typeof postTypes)[number];

export const postTypeLabels: Record<PostType, string> = {
  concept: 'Concept',
  experiment: 'Experiment',
  'case-study': 'Case Study',
  demo: 'Demo',
  tutorial: 'Tutorial',
  note: 'Note',
};

/** Ngày tháng hiển thị bằng font JetBrains Mono, định dạng vi-VN. */
export const formatPostDate = (date: Date): string =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(date);
