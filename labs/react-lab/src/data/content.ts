export const postTypes = ['concept', 'guide', 'note'] as const;
export type PostType = (typeof postTypes)[number];

export const postTypeLabels: Record<PostType, string> = {
  concept: 'Cơ chế',
  guide: 'Hướng dẫn',
  note: 'Ghi chú',
};

export const topics = [
  'hooks',
  'lifecycle',
  'rendering',
  'state',
  'performance',
  'libraries',
] as const;
export type Topic = (typeof topics)[number];

export const topicLabels: Record<Topic, string> = {
  hooks: 'Hooks',
  lifecycle: 'Lifecycle',
  rendering: 'Rendering',
  state: 'State',
  performance: 'Performance',
  libraries: 'Thư viện',
};

export const topicDescriptions: Record<Topic, string> = {
  hooks: 'useState, useEffect, useMemo và cách React gom, huỷ, chạy lại chúng.',
  lifecycle: 'Vòng đời của component và effect: mount, update, cleanup.',
  rendering: 'Element tree, Fiber, reconciliation và concurrent rendering.',
  state: 'State trong React, state bên ngoài và các mô hình đồng bộ.',
  performance: 'Đo render, tránh việc thừa và chọn chỗ tối ưu đúng.',
  libraries: 'Redux Toolkit, React Hook Form, TanStack Query, Zustand và cách chọn.',
};

export const levels = ['co-ban', 'trung-cap', 'nang-cao'] as const;
export type Level = (typeof levels)[number];

export const levelLabels: Record<Level, string> = {
  'co-ban': 'Cơ bản',
  'trung-cap': 'Trung cấp',
  'nang-cao': 'Nâng cao',
};

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(date);

export const estimateReadingMinutes = (body: string | undefined): number => {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
