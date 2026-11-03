import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'layout',
  title: 'Layout & AnimatePresence',
  group: 'layout',
  order: 30,
  summary: 'Đổi bố cục và thêm/bớt phần tử mà không bị nhảy giật.',
  api: ['layout', 'AnimatePresence', 'initial={false}', 'exit'],
  pitfalls: [
    'Thiếu AnimatePresence thì exit không chạy, phần tử biến mất ngay.',
    'layout trên danh sách dài rất tốn: đo lại mỗi lần, tránh dùng cho hàng trăm phần tử.',
  ],
  code: `<AnimatePresence initial={false}>
  {items.map((item) => (
    <motion.li key={item} layout exit={{ opacity: 0, x: -16 }} />
  ))}
</AnimatePresence>`,
};
