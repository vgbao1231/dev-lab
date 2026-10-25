/**
 * Danh sách cover có sẵn trong `src/assets/covers/`.
 *
 * Cover là SVG vẽ tay, được nhúng inline để dùng chung token màu với theme. Vì vậy
 * frontmatter chỉ lưu khóa (`react-fiber`), không lưu đường dẫn file. Thêm cover mới:
 * thêm file SVG cùng tên vào `src/assets/covers/` rồi thêm khóa vào đây.
 */
export const coverIds = ['react-fiber', 'react-scheduler', 'react-tearing'] as const;

export type CoverId = (typeof coverIds)[number];

const coverIdSet = new Set<string>(coverIds);

export const isCoverId = (value: string): value is CoverId => coverIdSet.has(value);
