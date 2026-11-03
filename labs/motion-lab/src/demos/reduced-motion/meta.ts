import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'reduced-motion',
  title: 'Giảm chuyển động',
  group: 'accessibility',
  order: 60,
  summary: 'Tôn trọng lựa chọn của người dùng mà không làm mất thông tin.',
  api: ['useReducedMotion', 'MotionConfig reducedMotion="user"'],
  pitfalls: [
    'Motion không tự tắt transform khi người dùng chọn giảm chuyển động: phải tự xử lý.',
    'Đừng bỏ hẳn phản hồi trạng thái; giảm chuyển động nghĩa là đổi cách, không phải mất thông tin.',
  ],
  code: `const reduce = useReducedMotion();

<motion.div
  animate={{ x: on ? 200 : 0, opacity: 1 }}
  transition={reduce ? { duration: 0 } : { type: 'spring' }}
/>`,
};
