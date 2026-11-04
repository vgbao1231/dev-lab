import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import './styles.css';

const ROWS = ['Giới thiệu', 'Thiết kế', 'Cài đặt', 'Phản hồi', 'Kết luận'];

/**
 * Scroll-linked motion inside a local viewport, so the demo does not depend on
 * the page scroll. The container's own scroll progress drives a parallax card
 * (smoothed by a spring) and a bar plus a percent readout, so the state stays
 * visible even when motion is reduced.
 */
export default function ScrollDemo() {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: viewportRef });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const smooth = useSpring(y, { stiffness: 120, damping: 24 });
  // Keep the card still when motion is reduced, without branching on hooks.
  const cardY = useTransform(smooth, (value) => (reduce ? 0 : value));
  const percent = useTransform(scrollYProgress, (value) => `${Math.round(value * 100)}%`);

  return (
    <div className="scroll-demo">
      <div
        className="scroll-viewport"
        ref={viewportRef}
        // A scrollable region must be focusable so it can be scrolled with the
        // arrow keys (WAI-ARIA "scrollable region" pattern). The rule is too
        // strict for this case; the focus is real and labelled via aria-label.
        // eslint-disable-next-line jsx-a11y-x/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label="Vùng cuộn thử nghiệm"
      >
        <div className="scroll-track">
          <motion.div className="scroll-card" style={{ y: cardY }} aria-hidden="true">
            <span className="chip">Parallax</span>
            <p className="scroll-card__text">
              Thẻ này dịch ngược với hướng cuộn theo tiến trình cuộn của vùng.
            </p>
          </motion.div>

          {ROWS.map((row) => (
            <div className="scroll-row" key={row}>
              <span className="scroll-row__marker" aria-hidden="true" />
              <span className="scroll-row__label">{row}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-row">
        <div className="scroll-progress" aria-hidden="true">
          <motion.div className="scroll-progress__fill" style={{ scaleX: scrollYProgress }} />
        </div>
        <motion.span className="demo-output" role="status">
          {percent}
        </motion.span>
      </div>

      <p className="demo-hint">
        Focus vào vùng cuộn rồi dùng phím mũi tên, hoặc cuộn bằng chuột. Thanh tiến trình và phần
        trăm luôn cho biết vị trí hiện tại.
        {reduce ? ' Đang giảm chuyển động: thẻ đứng yên, thanh tiến trình bám ngay theo cuộn.' : ''}
      </p>
    </div>
  );
}
