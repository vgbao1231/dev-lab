import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import './styles.css';

const SPRING: Transition = { type: 'spring', stiffness: 220, damping: 18 };
const TWEEN: Transition = { type: 'tween', duration: 0.4, ease: 'easeInOut' };
const JUMP: Transition = { duration: 0 };

/**
 * Both dots travel the same distance to the same goal line. Only the
 * transition differs: one spring, one tween. The lane is measured so the
 * travel stays correct when the stage is resized, without hard-coded pixels.
 */
export default function SpringsDemo() {
  const reduce = useReducedMotion();
  const [atEnd, setAtEnd] = useState(false);
  const [travel, setTravel] = useState(0);
  const laneRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lane = laneRef.current;
    const dot = dotRef.current;
    if (!lane || !dot) return;

    const measure = () => {
      const styles = getComputedStyle(lane);
      const insets =
        Number.parseFloat(styles.paddingInlineStart) + Number.parseFloat(styles.paddingInlineEnd);
      setTravel(Math.max(0, lane.clientWidth - dot.offsetWidth - insets));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(lane);
    return () => observer.disconnect();
  }, []);

  const destination = atEnd ? 'vạch đích bên phải' : 'vị trí đầu bên trái';

  return (
    <div className="springs-demo">
      <div className="demo-row">
        <button type="button" className="demo-button" onClick={() => setAtEnd((value) => !value)}>
          Đổi đích
        </button>
        <button type="button" className="demo-button" onClick={() => setAtEnd(false)}>
          Về vị trí đầu
        </button>
        <p className="demo-output" role="status">
          Đích hiện tại: {destination}
        </p>
      </div>

      <p className="demo-hint">
        Hai dot cùng đi một quãng đường tới cùng một vạch đích, chỉ khác cách chúng tới đó: spring
        vượt đích rồi trở lại, tween dừng đúng lúc.
      </p>

      <div className="springs-lanes">
        <section className="springs-lane-group" aria-labelledby="springs-label-spring">
          <div className="springs-lane-head">
            <h2 className="springs-lane-title" id="springs-label-spring">
              Spring
            </h2>
            <span className="chip">stiffness 220 · damping 18</span>
          </div>
          <div className="springs-lane" ref={laneRef}>
            <span className="springs-goal" aria-hidden="true" />
            <motion.span
              className="springs-dot springs-dot--spring"
              aria-hidden="true"
              animate={{ x: atEnd ? travel : 0 }}
              transition={reduce ? JUMP : SPRING}
            />
          </div>
          <p className="demo-hint">
            Không có thời lượng cố định: quãng đường và độ cứng quyết định.
          </p>
        </section>

        <section className="springs-lane-group" aria-labelledby="springs-label-tween">
          <div className="springs-lane-head">
            <h2 className="springs-lane-title" id="springs-label-tween">
              Tween
            </h2>
            <span className="chip">duration 0.4s · easeInOut</span>
          </div>
          <div className="springs-lane">
            <span className="springs-goal" aria-hidden="true" />
            <motion.span
              ref={dotRef}
              className="springs-dot springs-dot--tween"
              aria-hidden="true"
              animate={{ x: atEnd ? travel : 0 }}
              transition={reduce ? JUMP : TWEEN}
            />
          </div>
          <p className="demo-hint">Dừng đúng vạch đích sau 400ms, không bao giờ vượt quá.</p>
        </section>
      </div>

      {reduce ? (
        <p className="demo-hint">
          Đang giảm chuyển động: cả hai dot nhảy ngay tới đích, nhãn trạng thái vẫn cập nhật.
        </p>
      ) : null}
    </div>
  );
}
