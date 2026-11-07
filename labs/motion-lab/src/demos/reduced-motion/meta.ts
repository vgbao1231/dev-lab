import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'reduced-motion',
  title: 'Giảm chuyển động',
  group: 'accessibility',
  order: 60,
  summary: 'Tôn trọng lựa chọn của người dùng mà không làm mất thông tin.',
  preview: 'reduce',
  api: ['useReducedMotion'],
  pitfalls: [
    'Motion không tự tắt transform khi người dùng chọn giảm chuyển động: phải tự xử lý.',
    'Đừng bỏ hẳn phản hồi trạng thái; giảm chuyển động nghĩa là đổi cách, không phải mất thông tin.',
    'Chỉ dựa vào setting của OS thì không chứng minh được gì: cần một cờ mô phỏng để so sánh cả hai chế độ.',
  ],
  code: `const systemReduce = useReducedMotion();
const reduce = systemReduce || simulated;

<motion.div
  initial={false}
  animate={{ x: atEnd ? '100%' : '0%' }}
  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
/>`,
};
