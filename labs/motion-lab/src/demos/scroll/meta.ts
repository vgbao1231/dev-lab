import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'scroll',
  title: 'Scroll-linked motion',
  group: 'scroll',
  order: 40,
  summary: 'Gắn chuyển động vào tiến trình cuộn thay vì một animation có thời lượng.',
  api: ['useScroll', 'useTransform', 'useSpring', 'offset'],
  pitfalls: [
    'Cần target + offset rõ ràng, nếu không tiến trình sẽ chạy theo cả trang và khó đoán.',
    'Đừng map trực tiếp scrollYProgress vào thuộc tính gây layout; ưu tiên transform và opacity.',
  ],
  code: `const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start'],
});
const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
const smooth = useSpring(y, { stiffness: 120, damping: 24 });`,
};
