import type { ReactNode } from 'react';
import type { DemoPreview as DemoPreviewKind } from '../demos/types';

/**
 * The card visual on the index. It is deliberately not the demo: it is a one-shot
 * CSS animation that shows the rhythm a demo is about, so a reader can scan the
 * list without opening every page. The kinds share one caption and the shell
 * styles them through `preview--<kind>` in `src/styles.css`.
 *
 * The caption names the motion in plain words. A reader who has never opened a
 * demo should be able to tell "spring" from "stagger" from "layout" without
 * recognising the shape first.
 *
 * The visual is `aria-hidden`: the caption, title and summary already carry the
 * meaning. The animation plays once on mount and replays when the card is
 * hovered or focused (the parent remounts it).
 */
const PREVIEW_LABELS: Record<DemoPreviewKind, string> = {
  spring: 'vượt đích rồi dừng',
  stagger: 'lần lượt, cách nhau 90ms',
  gesture: 'trỏ vào, chạm, kéo',
  layout: 'hàng đổi chỗ, không nhảy',
  scroll: 'cuộn tới đâu chạy tới đó',
  reduce: 'nhảy thẳng, bỏ easing',
};

const PreviewShape = ({ kind }: { kind: DemoPreviewKind }): ReactNode => {
  switch (kind) {
    case 'spring':
      return (
        <>
          <span className="preview__track" />
          <span className="preview__goal" />
          <span className="preview__trail preview__trail--1" />
          <span className="preview__trail preview__trail--2" />
          <span className="preview__ball" />
        </>
      );

    case 'stagger':
      return (
        <>
          <span className="preview__baseline" />
          {[0, 1, 2, 3, 4].map((bar) => (
            <span key={bar} className="preview__bar" />
          ))}
        </>
      );

    case 'gesture':
      return (
        <>
          <span className="preview__button" />
          <span className="preview__ripple" />
          <span className="preview__pointer">
            <svg viewBox="0 0 20 24" fill="none" aria-hidden="true">
              <path
                d="M4 2.5l11.5 7.2-5.2 1.5 2.6 6.4-2.6 1-2.7-6.5L4 15.7z"
                fill="currentColor"
                stroke="var(--lab-bg)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </>
      );

    case 'layout':
      return (
        <>
          <span className="preview__slot" />
          <span className="preview__row preview__row--top" />
          <span className="preview__row preview__row--mid" />
          <span className="preview__row preview__row--bottom" />
        </>
      );

    case 'scroll':
      return (
        <>
          <span className="preview__viewport">
            <span className="preview__scroller">
              {[0, 1, 2, 3, 4].map((line) => (
                <span key={line} className="preview__line" />
              ))}
            </span>
          </span>
          <span className="preview__scrollbar" />
          <span className="preview__thumb" />
          <span className="preview__progress">
            <span className="preview__progress-fill" />
          </span>
        </>
      );

    case 'reduce':
      return (
        <>
          <span className="preview__track preview__track--dashed" />
          <span className="preview__ghost" />
          <span className="preview__flash" />
          <span className="preview__ball preview__ball--instant" />
          <span className="preview__tag">0ms</span>
        </>
      );
  }
};

export const DemoPreview = ({ kind }: { kind: DemoPreviewKind }) => (
  <span className={`preview preview--${kind}`}>
    <span className="preview__visual" aria-hidden="true">
      <PreviewShape kind={kind} />
    </span>
    <span className="preview__caption">
      <span className="preview__kind">{kind}</span>
      <span className="preview__label">{PREVIEW_LABELS[kind]}</span>
      <span className="preview__replay" aria-hidden="true">
        ↻
      </span>
    </span>
  </span>
);

export default DemoPreview;
