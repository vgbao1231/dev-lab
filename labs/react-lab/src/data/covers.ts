export const coverIds = ['react-fiber', 'react-scheduler', 'react-tearing'] as const;

export type CoverId = (typeof coverIds)[number];

const coverIdSet = new Set<string>(coverIds);

export const isCoverId = (value: string): value is CoverId => coverIdSet.has(value);
