import type { ComponentType } from 'react';
import type { Demo, DemoGroup, DemoMeta } from './types';

export type { Demo, DemoGroup, DemoMeta } from './types';

export const demoGroups: { id: DemoGroup; label: string }[] = [
  { id: 'core', label: 'Cơ bản' },
  { id: 'gestures', label: 'Gesture' },
  { id: 'layout', label: 'Layout' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'accessibility', label: 'Accessibility' },
];

/**
 * Auto-discovered registry. Each demo is a self-contained folder:
 *
 *   src/demos/<id>/meta.ts    metadata, imported eagerly (small, no React)
 *   src/demos/<id>/index.tsx  the demo, imported lazily (one chunk per demo)
 *   src/demos/<id>/styles.css imported by that index.tsx (ships with the chunk)
 *
 * A work package owns one folder and never edits this file, so demo packages
 * can be built in parallel without conflicts. A folder without `index.tsx` is
 * skipped, which keeps the lab building while a demo is still being written.
 */
const metaModules = import.meta.glob<{ meta: DemoMeta }>('./*/meta.ts', { eager: true });
const componentModules = import.meta.glob<{ default: ComponentType }>('./*/index.tsx');

const toComponentPath = (metaPath: string): string => metaPath.replace(/meta\.ts$/, 'index.tsx');

export const demos: Demo[] = Object.entries(metaModules)
  .flatMap(([path, module]) => {
    const load = componentModules[toComponentPath(path)];
    return load ? [{ ...module.meta, load }] : [];
  })
  .sort((a, b) => a.order - b.order);
