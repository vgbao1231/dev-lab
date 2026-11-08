export type PlaygroundPreset = {
  id: string;
  label: string;
  note: string;
  code: string;
  /** The same idea written with the React API; shown read-only. */
  reactCode: string;
};

const spring: PlaygroundPreset = {
  id: 'spring',
  label: 'Spring',
  note: 'Đổi stiffness và damping để thấy độ nảy, quãng overshoot và thời gian settle.',
  code: `animate(
  box,
  { x: distance, rotate: 6 },
  { type: 'spring', stiffness: 220, damping: 18 },
);`,
  reactCode: `<motion.div
  animate={{ x: distance, rotate: 6 }}
  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
/>`,
};

const tween: PlaygroundPreset = {
  id: 'tween',
  label: 'Tween',
  note: 'Tween có duration cố định; đổi ease để so sánh cảm giác nhanh chậm.',
  code: `animate(
  box,
  { x: distance },
  { type: 'tween', duration: 0.6, ease: 'easeInOut' },
);`,
  reactCode: `<motion.div
  animate={{ x: distance }}
  transition={{ type: 'tween', duration: 0.6, ease: 'easeInOut' }}
/>`,
};

const stagger: PlaygroundPreset = {
  id: 'stagger',
  label: 'Stagger',
  note: 'Một lệnh cho cả nhóm; delay giữa các phần tử quyết định nhịp.',
  code: `animate(
  dots,
  { opacity: [0.2, 1], y: [18, 0] },
  { delay: stagger(0.09), duration: 0.35 },
);`,
  reactCode: `<motion.div initial="hidden" animate="visible">
  {dots.map((dot, index) => (
    <motion.span
      key={dot.id}
      variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1, y: 0 } }}
      transition={{ delay: index * 0.09, duration: 0.35 }}
    />
  ))}
</motion.div>`,
};

const easing: PlaygroundPreset = {
  id: 'easing',
  label: 'Easing',
  note: 'Cùng một quãng đường, đổi đường cong để thấy tốc độ vào và ra khác nhau.',
  code: `animate(
  box,
  { x: distance },
  { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
);`,
  reactCode: `<motion.div
  animate={{ x: distance }}
  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
/>`,
};

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [spring, tween, stagger, easing];

export const DEFAULT_PRESET = spring;

/**
 * What the playground is currently editing: one of the four presets, or the
 * vanilla translation of a demo. Keeping both in one shape lets the stage,
 * editor and React block stay unaware of where the snippet came from.
 */
export type PlaygroundSource = {
  id: string;
  label: string;
  note: string;
  code: string;
  reactCode: string;
  /** Set when the source is one of the four preset chips. */
  presetId?: string;
  /** Set when the source belongs to a demo page. */
  demoId?: string;
};

export const sourceFromPreset = (preset: PlaygroundPreset): PlaygroundSource => ({
  id: preset.id,
  label: preset.label,
  note: preset.note,
  code: preset.code,
  reactCode: preset.reactCode,
  presetId: preset.id,
});
