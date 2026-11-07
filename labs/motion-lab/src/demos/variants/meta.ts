import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'variants',
  title: 'Variants & stagger',
  group: 'core',
  order: 10,
  summary: 'Khai báo trạng thái một lần, cho parent điều phối và trẻ con chạy so le.',
  preview: 'stagger',
  api: ['initial', 'animate', 'variants', 'staggerChildren', 'delayChildren'],
  pitfalls: [
    'Quên đặt initial/animate ở parent thì variants của con không tự chạy.',
    'Stagger chỉ hoạt động khi các con là motion component và nhận variants từ parent.',
  ],
  code: `const list: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.15, staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0.35 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
<motion.ul variants={list} initial="hidden" animate={open ? 'visible' : 'hidden'}>
  {steps.map((step) => <motion.li key={step.api} variants={item}>{step.api}</motion.li>)}
</motion.ul>`,
};
