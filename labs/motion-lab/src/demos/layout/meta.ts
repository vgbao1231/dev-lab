import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'layout',
  title: 'Layout & AnimatePresence',
  group: 'layout',
  order: 30,
  summary: 'Đổi bố cục và thêm/bớt phần tử mà không bị nhảy giật.',
  preview: 'layout',
  api: ['layout', 'AnimatePresence', 'initial={false}', 'exit'],
  pitfalls: [
    'Thiếu AnimatePresence thì exit không chạy, phần tử biến mất ngay.',
    'layout trên danh sách dài rất tốn: đo lại mỗi lần, tránh dùng cho hàng trăm phần tử.',
  ],
  code: `<AnimatePresence initial={false}>
  {items.map((item) => (
    <motion.li
      key={item.id}
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
    />
  ))}
</AnimatePresence>`,
};
