import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'gestures',
  title: 'Hover, tap & drag',
  group: 'gestures',
  order: 20,
  summary: 'Phản hồi theo thao tác người dùng mà không cần state thủ công.',
  api: ['whileHover', 'whileTap', 'whileDrag', 'drag', 'dragConstraints', 'dragElastic'],
  pitfalls: [
    'drag cần một vùng giới hạn (ref) nếu không phần tử sẽ kéo ra khỏi bố cục.',
    'Đừng dùng hover làm cách duy nhất để lộ thông tin: thiết bị cảm ứng không có hover.',
  ],
  code: `<motion.div
  drag
  dragConstraints={boundsRef}
  dragElastic={0.18}
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  whileDrag={{ cursor: 'grabbing' }}
/>`,
};
