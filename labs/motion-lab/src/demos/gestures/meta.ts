import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'gestures',
  title: 'Hover, tap & drag',
  group: 'gestures',
  order: 20,
  summary: 'Phản hồi theo thao tác người dùng mà không cần state thủ công.',
  preview: 'gesture',
  api: ['whileHover', 'whileTap', 'whileDrag', 'drag', 'dragConstraints', 'dragElastic'],
  pitfalls: [
    'drag cần một vùng giới hạn (ref) nếu không phần tử sẽ kéo ra khỏi bố cục.',
    'Đừng dùng hover làm cách duy nhất để lộ thông tin: thiết bị cảm ứng không có hover.',
  ],
  code: `<motion.button
  whileHover={reduce ? { opacity: 0.92 } : { scale: 1.03 }}
  whileTap={reduce ? { opacity: 0.8 } : { scale: 0.96 }}
  onClick={activate}
/>

<motion.div
  drag
  dragConstraints={frameRef}
  dragElastic={reduce ? 0 : 0.18}
  whileDrag={{ scale: 1.03 }}
/>`,
};
