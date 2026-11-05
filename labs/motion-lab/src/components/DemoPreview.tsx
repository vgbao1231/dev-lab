import type { DemoPreview as DemoPreviewKind } from '../demos/types';

/**
 * The card visual on the index. It is deliberately not the demo: it is a 72px
 * one-shot CSS animation that shows the rhythm a demo is about, so a reader can
 * scan the list without opening every page. The kinds share one markup; each
 * kind is styled by `preview--<kind>` in `src/styles.css`.
 *
 * `aria-hidden`: the title and summary already carry the meaning, and screen
 * readers should not hear decorative motion. The animation plays once on mount
 * and replays when the card is hovered or focused (the parent remounts it).
 */
export const DemoPreview = ({ kind }: { kind: DemoPreviewKind }) => (
  <span className={`preview preview--${kind}`} aria-hidden="true">
    <span className="preview__item preview__item--1" />
    <span className="preview__item preview__item--2" />
    <span className="preview__item preview__item--3" />
    <span className="preview__item preview__item--4" />
  </span>
);

export default DemoPreview;
