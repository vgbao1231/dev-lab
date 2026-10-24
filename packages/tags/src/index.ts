/**
 * Registry tag dùng chung cho portal và các lab.
 *
 * Quy ước đầy đủ ở `docs/TAGS.md`: mỗi bài 1–4 tag (khuyến nghị 2–3), tag là
 * metadata độc lập với `lab`, `type` và category.
 */

export const tagGroups = ['technology', 'domain', 'approach'] as const;

export type TagGroup = (typeof tagGroups)[number];

export const tagGroupLabels: Record<TagGroup, string> = {
  technology: 'Technology',
  domain: 'Domain',
  approach: 'Approach',
};

export type Tag = {
  id: string;
  /** Tên hiển thị, giữ cách viết chính thức của công nghệ/khái niệm. */
  label: string;
  group: TagGroup;
  /** Một câu giải thích phạm vi để tránh dùng trùng nghĩa. */
  description: string;
};

export const tags = [
  // Technology — công cụ, ngôn ngữ, nền tảng.
  {
    id: 'react',
    label: 'React',
    group: 'technology',
    description: 'React, hooks, rendering và hệ sinh thái liên quan.',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    group: 'technology',
    description: 'Type system, generic, strict mode và tooling của TypeScript.',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    group: 'technology',
    description: 'Ngôn ngữ JavaScript, runtime và các cơ chế của nó.',
  },
  {
    id: 'astro',
    label: 'Astro',
    group: 'technology',
    description: 'Astro, islands, content collections và build tĩnh.',
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    group: 'technology',
    description: 'Next.js, SSR/SSG, Server Components và caching.',
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    group: 'technology',
    description: 'Runtime Node.js, HTTP, middleware và API.',
  },
  {
    id: 'docker',
    label: 'Docker',
    group: 'technology',
    description: 'Container, image, compose và môi trường chạy.',
  },
  {
    id: 'sql',
    label: 'SQL',
    group: 'technology',
    description: 'Ngôn ngữ truy vấn, index, join và transaction.',
  },
  {
    id: 'git',
    label: 'Git',
    group: 'technology',
    description: 'Commit graph, merge, rebase và quy trình làm việc với Git.',
  },

  // Domain — lĩnh vực hoặc khái niệm kỹ thuật.
  {
    id: 'frontend',
    label: 'Frontend',
    group: 'domain',
    description: 'Xây dựng giao diện và trải nghiệm phía client.',
  },
  {
    id: 'backend',
    label: 'Backend',
    group: 'domain',
    description: 'API, service và xử lý phía server.',
  },
  {
    id: 'performance',
    label: 'Performance',
    group: 'domain',
    description: 'Tốc độ tải, chi phí runtime và các chỉ số hiệu năng.',
  },
  {
    id: 'rendering',
    label: 'Rendering',
    group: 'domain',
    description: 'Cơ chế tạo và cập nhật UI: render, reconciliation, commit.',
  },
  {
    id: 'state-management',
    label: 'State Management',
    group: 'domain',
    description: 'Quản lý, chia sẻ và đồng bộ state trong ứng dụng.',
  },
  {
    id: 'concurrency',
    label: 'Concurrency',
    group: 'domain',
    description: 'Xử lý song song, scheduling, interrupt và tính nhất quán.',
  },
  {
    id: 'testing',
    label: 'Testing',
    group: 'domain',
    description: 'Unit, integration, E2E và chiến lược kiểm thử.',
  },
  {
    id: 'database',
    label: 'Database',
    group: 'domain',
    description: 'Mô hình dữ liệu, truy vấn, transaction và isolation.',
  },
  {
    id: 'devops',
    label: 'DevOps',
    group: 'domain',
    description: 'Build, deploy, CI/CD và vận hành hệ thống.',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    group: 'domain',
    description: 'CDN, serverless và hạ tầng cloud.',
  },

  // Approach — góc tiếp cận của bài viết.
  {
    id: 'internals',
    label: 'Internals',
    group: 'approach',
    description: 'Đi vào cơ chế bên trong runtime hoặc framework.',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    group: 'approach',
    description: 'Cấu trúc hệ thống, ranh giới và đánh đổi thiết kế.',
  },
  {
    id: 'debugging',
    label: 'Debugging',
    group: 'approach',
    description: 'Tìm nguyên nhân lỗi và cách quan sát hệ thống.',
  },
  {
    id: 'benchmarking',
    label: 'Benchmarking',
    group: 'approach',
    description: 'Đo lường và so sánh có kiểm soát, có thể tái lập.',
  },
] as const satisfies readonly Tag[];

export type TagId = (typeof tags)[number]['id'];

export const tagIds: readonly TagId[] = tags.map((tag) => tag.id);

const tagById = new Map<string, Tag>(tags.map((tag) => [tag.id, tag]));

const groupOrder = new Map<TagGroup, number>(tagGroups.map((group, index) => [group, index]));

export const isTagId = (value: string): value is TagId => tagById.has(value);

export const getTag = (id: TagId): Tag => {
  const tag = tagById.get(id);

  if (!tag) {
    throw new Error(`Tag không có trong registry: ${id}`);
  }

  return tag;
};

/**
 * Sắp xếp theo Technology → Domain → Approach, cùng nhóm thì theo label.
 * Nhờ vậy thứ tự tag trong frontmatter không ảnh hưởng tới UI.
 */
export const sortTags = (ids: readonly TagId[]): Tag[] =>
  ids
    .map(getTag)
    .sort(
      (a, b) =>
        (groupOrder.get(a.group) ?? 0) - (groupOrder.get(b.group) ?? 0) ||
        a.label.localeCompare(b.label, 'en'),
    );
