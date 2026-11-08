/**
 * Cover ids available in `src/assets/covers/`.
 *
 * The React-specific covers moved to `labs/react-lab/src/assets/covers/` with
 * their articles. Add a new id here (and the SVG) when a general portal article
 * needs a cover again.
 */
export const coverIds = [] as const;

export type CoverId = (typeof coverIds)[number];

const coverIdSet = new Set<string>(coverIds);

export const isCoverId = (value: string): value is CoverId => coverIdSet.has(value);
