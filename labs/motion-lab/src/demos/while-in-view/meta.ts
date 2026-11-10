import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'while-in-view',
  title: 'Reveal khi vào khung nhìn',
  group: 'scroll',
  order: 45,
  summary: 'Chạy chuyển động khi phần tử vào viewport, không phải tự tính vị trí cuộn.',
  preview: 'scroll',
  api: ['whileInView', 'viewport={{ root, once, amount }}', 'onViewportEnter'],
  pitfalls: [
    'viewport mặc định là cả trang; trong một khung cuộn riêng phải truyền root, nếu không mục được tính là “đã thấy” từ trước khi cuộn.',
    'once: true chỉ chạy lần đầu; đừng dùng khi nội dung cần phản hồi lại mỗi lần quay lại khung nhìn.',
    'Ẩn bằng initial mà thiếu whileInView thì nội dung có thể nằm ở opacity 0 mãi; luôn có trạng thái đích.',
  ],
  code: `<motion.li
  initial={reduce ? false : { opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ root: scrollerRef, once, amount: 0.4 }}
  transition={reduce ? { duration: 0 } : REVEAL}
  onViewportEnter={() => markSeen(step.api)}
/>`,
};
