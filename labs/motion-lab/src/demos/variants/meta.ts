import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'variants',
  title: 'Variants & stagger',
  group: 'core',
  order: 10,
  summary: 'Khai báo trạng thái một lần, cho parent điều phối và trẻ con chạy so le.',
  api: ['initial', 'animate', 'variants', 'staggerChildren', 'delayChildren'],
  pitfalls: [
    'Quên đặt initial/animate ở parent thì variants của con không tự chạy.',
    'Stagger chỉ hoạt động khi các con là motion component và nhận variants từ parent.',
  ],
  code: `const list = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

<motion.ul variants={list} initial="hidden" animate={open ? 'visible' : 'hidden'}>
  {items.map((item) => (
    <motion.li key={item} variants={cell} />
  ))}
</motion.ul>`,
};
