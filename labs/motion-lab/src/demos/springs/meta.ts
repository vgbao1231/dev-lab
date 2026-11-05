import type { DemoMeta } from '../types';

export const meta: DemoMeta = {
  id: 'springs',
  title: 'Spring và tween',
  group: 'core',
  order: 50,
  summary: 'Cùng một đích đến, hai cách cảm nhận thời gian khác nhau.',
  preview: 'spring',
  api: ['type: "spring"', 'stiffness', 'damping', 'type: "tween"', 'duration', 'ease'],
  pitfalls: [
    'Spring không có duration cố định; đừng cố ép nó thành đúng 300ms.',
    'Damping quá thấp sẽ rung, quá cao sẽ chậm và nặng — chỉnh theo khối lượng và quãng đường.',
  ],
  code: `const SPRING: Transition = { type: 'spring', stiffness: 220, damping: 18 };
const TWEEN: Transition = { type: 'tween', duration: 0.4, ease: 'easeInOut' };
const JUMP: Transition = { duration: 0 };

<motion.span animate={{ x: atEnd ? travel : 0 }} transition={reduce ? JUMP : SPRING} />
<motion.span animate={{ x: atEnd ? travel : 0 }} transition={reduce ? JUMP : TWEEN} />`,
};
