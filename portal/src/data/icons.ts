/**
 * Danh mục icon dùng chung — docs/design/components.md, mục Icon.
 *
 * Tách khỏi `Icon.astro` để component không export giá trị (quy ước Astro), và để
 * nơi khác có thể kiểm tra tên icon mà không import component.
 */
export const iconNames = [
  'leaf',
  'search',
  'sun',
  'moon',
  'monitor',
  'flask',
  'file-text',
  'calendar',
  'clock',
  'github',
  'x',
  'enter',
  'arrow-up',
  'arrow-down',
] as const;

export type IconName = (typeof iconNames)[number];
