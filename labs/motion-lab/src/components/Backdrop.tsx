import { useEffect, useRef } from 'react';

/**
 * The lab's own backdrop: three violet blooms that drift slowly and five light
 * streaks that travel across the viewport. The portal's home page uses organic
 * blobs and floating dust; this one is about velocity, so the streaks read as
 * "something just moved through here".
 *
 * The layer is fixed behind the whole app, `aria-hidden`, and paints with
 * `opacity` and `transform` only. Pointer movement adds a small parallax, driven
 * by one `requestAnimationFrame` loop that stops as soon as it settles. Both the
 * CSS drift and the parallax are disabled when the visitor asks for reduced
 * motion.
 */
const BLOOMS = ['a', 'b', 'c'] as const;
const STREAKS = 5;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const Backdrop = () => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const media = globalThis.matchMedia?.(REDUCED_MOTION_QUERY);

    if (!layer || !media) {
      return;
    }

    let stop: (() => void) | undefined;

    // The parallax loop is started and stopped from one place, so a preference
    // change while the page is open is honoured without a reload.
    const start = (): (() => void) => {
      let targetX = 0;
      let targetY = 0;
      let x = 0;
      let y = 0;
      let frame = 0;

      const settle = () => {
        x += (targetX - x) * 0.06;
        y += (targetY - y) * 0.06;

        layer.style.setProperty('--backdrop-x', x.toFixed(4));
        layer.style.setProperty('--backdrop-y', y.toFixed(4));

        if (Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002) {
          frame = globalThis.requestAnimationFrame(settle);
        } else {
          frame = 0;
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        targetX = (event.clientX / globalThis.innerWidth - 0.5) * 2;
        targetY = (event.clientY / globalThis.innerHeight - 0.5) * 2;

        if (!frame) {
          frame = globalThis.requestAnimationFrame(settle);
        }
      };

      globalThis.addEventListener('pointermove', onPointerMove, { passive: true });

      return () => {
        globalThis.removeEventListener('pointermove', onPointerMove);

        if (frame) {
          globalThis.cancelAnimationFrame(frame);
        }

        layer.style.removeProperty('--backdrop-x');
        layer.style.removeProperty('--backdrop-y');
      };
    };

    const sync = () => {
      stop?.();
      stop = media.matches ? undefined : start();
    };

    media.addEventListener('change', sync);
    sync();

    return () => {
      media.removeEventListener('change', sync);
      stop?.();
    };
  }, []);

  return (
    <div className="backdrop" ref={layerRef} aria-hidden="true">
      {BLOOMS.map((bloom) => (
        <span key={bloom} className={`backdrop__bloom backdrop__bloom--${bloom}`} />
      ))}

      <span className="backdrop__streaks">
        {Array.from({ length: STREAKS }, (_, index) => (
          <span key={index} className="backdrop__streak" />
        ))}
      </span>
    </div>
  );
};

export default Backdrop;
