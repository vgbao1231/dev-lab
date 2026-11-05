import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'scroll',
  title: 'Scroll-linked motion',
  group: 'scroll',
  order: 40,
  summary: 'Gắn chuyển động vào tiến trình cuộn thay vì một animation có thời lượng.',
  preview: 'scroll',
  api: ['useScroll', 'useTransform', 'useSpring'],
  pitfalls: [
    'Gắn useScroll vào một vùng cuộn bên trong (container), không phải cuộn cả trang — nếu không tiến trình sẽ chạy theo cả trang và khó đoán.',
    'Đừng map trực tiếp scrollYProgress vào thuộc tính gây layout; ưu tiên transform và opacity.',
  ],
  code: `const { scrollYProgress } = useScroll({ container: viewportRef });
const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
const smooth = useSpring(y, { stiffness: 120, damping: 24 });`,
};
