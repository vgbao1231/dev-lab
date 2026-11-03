import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'springs',
  title: 'Spring và tween',
  group: 'core',
  order: 50,
  summary: 'Cùng một đích đến, hai cách cảm nhận thời gian khác nhau.',
  api: ['type: "spring"', 'stiffness', 'damping', 'type: "tween"', 'duration', 'ease'],
  pitfalls: [
    'Spring không có duration cố định; đừng cố ép nó thành đúng 300ms.',
    'Damping quá thấp sẽ rung, quá cao sẽ chậm và nặng — chỉnh theo khối lượng và quãng đường.',
  ],
  code: `<motion.div
  animate={{ x: on ? 220 : 0 }}
  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
/>

<motion.div
  animate={{ x: on ? 220 : 0 }}
  transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
/>`,
};
