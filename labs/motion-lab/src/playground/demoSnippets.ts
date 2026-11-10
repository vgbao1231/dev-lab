import { meta as gestures } from '../demos/gestures/meta';
import { meta as layout } from '../demos/layout/meta';
import { meta as reducedMotion } from '../demos/reduced-motion/meta';
import { meta as scroll } from '../demos/scroll/meta';
import { meta as springs } from '../demos/springs/meta';
import { meta as variants } from '../demos/variants/meta';
import { meta as whileInView } from '../demos/while-in-view/meta';
import type { DemoMeta } from '../demos/types';
import {
  DEFAULT_PRESET,
  PLAYGROUND_PRESETS,
  sourceFromPreset,
  type PlaygroundSource,
} from './presets';

type DemoSnippet = {
  meta: DemoMeta;
  /** Why the vanilla translation differs from the React demo. */
  note: string;
  code: string;
};

const SNIPPETS: DemoSnippet[] = [
  {
    meta: variants,
    note: 'Demo gom trạng thái ở parent; với DOM thuần, cùng nhịp đó viết bằng stagger(0.09) trên cả nhóm.',
    code: `animate(
  dots,
  { opacity: [0.2, 1], y: [18, 0] },
  { delay: stagger(0.09), duration: 0.35 },
);`,
  },
  {
    meta: gestures,
    note: 'Demo phản hồi theo hover, tap và drag; snippet mô phỏng một nhịp tap bằng keyframes scale để thấy overshoot.',
    code: `animate(
  box,
  { scale: [1, 1.08, 0.96, 1] },
  { duration: 0.55, ease: 'easeInOut' },
);`,
  },
  {
    meta: layout,
    note: 'Demo để layout tự nội suy khi DOM đổi; playground chỉ có một box nên cho nó bay sang đích bằng spring.',
    code: `animate(
  box,
  { x: distance, rotate: 180 },
  { type: 'spring', stiffness: 260, damping: 26 },
);`,
  },
  {
    meta: scroll,
    note: 'Demo buộc chuyển động vào scrollYProgress; ở đây cả quãng đường chạy một lần với ease linear để thấy tiến trình.',
    code: `animate(box, { x: distance }, { duration: 1.4, ease: 'linear' });`,
  },
  {
    meta: whileInView,
    note: 'Demo reveal theo khung cuộn riêng; playground không có viewport cuộn nên snippet chạy cùng nhịp reveal một lần cho cả nhóm dots.',
    code: `animate(
  dots,
  { opacity: [0.2, 1], y: [16, 0] },
  { delay: stagger(0.08), duration: 0.4, ease: 'easeOut' },
);`,
  },
  {
    meta: springs,
    note: 'Demo chạy spring và tween cạnh nhau; snippet giữ spring, đổi type sang tween để so cảm giác.',
    code: `animate(
  box,
  { x: distance },
  { type: 'spring', stiffness: 220, damping: 18 },
);`,
  },
  {
    meta: reducedMotion,
    note: 'Demo có cờ mô phỏng; snippet đọc thẳng setting của OS — bật giảm chuyển động rồi chạy lại để thấy khác biệt.',
    code: `const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

animate(
  box,
  { x: distance },
  { duration: reduce ? 0 : 0.6, ease: 'easeInOut' },
);`,
  },
];

const toSource = (snippet: DemoSnippet): PlaygroundSource => ({
  id: snippet.meta.id,
  label: snippet.meta.title,
  note: snippet.note,
  code: snippet.code,
  reactCode: snippet.meta.code,
  demoId: snippet.meta.id,
});

const DEMO_SOURCES: Record<string, PlaygroundSource> = Object.fromEntries(
  SNIPPETS.map((snippet) => [snippet.meta.id, toSource(snippet)]),
);

/** Accepts a demo id (`variants`), a preset id (`spring`) or nothing. */
export const resolveSource = (input: string | undefined): PlaygroundSource => {
  if (!input) {
    return sourceFromPreset(DEFAULT_PRESET);
  }

  const demo = DEMO_SOURCES[input];

  if (demo) {
    return demo;
  }

  const preset = PLAYGROUND_PRESETS.find((item) => item.id === input);
  return sourceFromPreset(preset ?? DEFAULT_PRESET);
};
