export type LabStatus = 'running' | 'planned' | 'idea';

export type Lab = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  status: LabStatus;
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
  },
  {
    slug: 'js-under-the-hood',
    name: 'JS Under the Hood',
    summary: 'Event loop, closure, prototype, Promise.',
    stack: ['JavaScript'],
    status: 'planned',
  },
  {
    slug: 'nextjs-lab',
    name: 'Next.js Lab',
    summary: 'SSR, SSG, Server Components và caching.',
    stack: ['Next.js'],
    status: 'planned',
  },
];

export const labStatusLabel: Record<LabStatus, string> = {
  running: 'Đang chạy',
  planned: 'Sắp tới',
  idea: 'Dự kiến',
};
