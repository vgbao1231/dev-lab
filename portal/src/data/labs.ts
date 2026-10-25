export type LabStatus = 'running' | 'planned' | 'idea';

export type Lab = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  status: LabStatus;
  /** Nhãn danh mục ngắn hiện ở chip trên ảnh bìa. */
  category?: string;
  /** CSS background cho ảnh bìa card. Để trống thì dùng màu surface. */
  coverBg?: string;
  /** Chỉ có khi lab đã có địa chỉ truy cập được. */
  href?: string;
};

/**
 * Danh sách lab hiện có.
 * Nguồn: docs/PROJECT_OVERVIEW.md mục 6 — đây là danh sách mở, sẽ thay đổi theo lộ trình.
 */
export const labs: Lab[] = [
  {
    slug: 'react-lab',
    name: 'React Lab',
    summary: 'Hooks, rendering, state và performance với số đo thực tế.',
    stack: ['React', 'TypeScript', 'Vite'],
    status: 'running',
    category: 'Frontend',
    coverBg:
      'radial-gradient(ellipse 60% 70% at 25% 115%, #12160f 55%, transparent 56%), radial-gradient(ellipse 70% 80% at 75% 120%, #171c13 55%, transparent 56%), linear-gradient(180deg, #4a554d, #2a312b)',
  },
  {
    slug: 'js-under-the-hood',
    name: 'JS Under the Hood',
    summary: 'Event loop, closure, prototype, Promise.',
    stack: ['JavaScript'],
    status: 'planned',
    category: 'Frontend',
    coverBg:
      'radial-gradient(circle at 82% 30%, rgba(120, 150, 96, .5), transparent 35%), linear-gradient(180deg, #171b13, #10130d)',
  },
  {
    slug: 'nextjs-lab',
    name: 'Next.js Lab',
    summary: 'SSR, SSG, Server Components và caching.',
    stack: ['Next.js'],
    status: 'planned',
    category: 'Frontend',
    coverBg:
      'radial-gradient(ellipse 80% 60% at 40% 125%, #0d100b 60%, transparent 61%), linear-gradient(180deg, #232c3a, #161b21)',
  },
];

export const labStatusLabel: Record<LabStatus, string> = {
  running: 'Đang chạy',
  planned: 'Sắp tới',
  idea: 'Dự kiến',
};
