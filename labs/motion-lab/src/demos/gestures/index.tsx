import { useRef, useState, type MouseEvent } from 'react';
import {
  animate,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import './styles.css';

type Point = { x: number; y: number };

type ActivationSource = 'keyboard' | 'pointer';

export default function GesturesDemo() {
  const reduce = useReducedMotion();
  const [activations, setActivations] = useState(0);
  const [source, setSource] = useState<ActivationSource | null>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

  const frameRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardControls = useAnimationControls();

  const activate = (event: MouseEvent<HTMLButtonElement>) => {
    // Keyboard-triggered clicks report detail 0; pointer clicks report 1 or more.
    const viaKeyboard = event.detail === 0;
    setActivations((count) => count + 1);
    setSource(viaKeyboard ? 'keyboard' : 'pointer');

    // whileTap already covers pointer presses. Keyboard activation gets the same
    // feedback through a short pulse that never scales when motion is reduced.
    if (!viaKeyboard) return;

    void cardControls.start(reduce ? { opacity: [1, 0.72, 1] } : { scale: [1, 0.96, 1] }, {
      duration: 0.3,
      ease: 'easeInOut',
    });
  };

  const resetDrag = () => {
    const transition: Transition = reduce
      ? { duration: 0 }
      : { type: 'spring', stiffness: 320, damping: 30 };

    void animate(x, 0, transition);
    void animate(y, 0, transition);
    setPosition({ x: 0, y: 0 });
  };

  const settleDrag = () => {
    setPosition({ x: Math.round(x.get()), y: Math.round(y.get()) });
  };

  const sourceLabel = source === 'keyboard' ? 'bàn phím' : 'chuột hoặc chạm';
  const cardStatus =
    activations === 0
      ? 'Thẻ: chưa kích hoạt.'
      : `Thẻ: ${activations} lượt kích hoạt, gần nhất bằng ${sourceLabel}.`;

  const dragStatus = dragging
    ? 'Ô kéo: đang kéo…'
    : position.x === 0 && position.y === 0
      ? 'Ô kéo: đang ở gốc.'
      : `Ô kéo: lệch ${position.x}px ngang, ${position.y}px dọc.`;

  return (
    <div className="gestures-demo">
      <div className="gestures-sections">
        <section className="gestures-section" aria-labelledby="gestures-card-label">
          <h2 className="gestures-heading" id="gestures-card-label">
            Thẻ phản hồi
          </h2>
          <motion.button
            className="gestures-card"
            type="button"
            animate={cardControls}
            whileHover={reduce ? { opacity: 0.92 } : { scale: 1.03, y: -2 }}
            whileTap={reduce ? { opacity: 0.8 } : { scale: 0.96 }}
            transition={
              reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 30 }
            }
            onClick={activate}
          >
            <span className="gestures-card__title">Rê hoặc nhấn thẻ</span>
            <span className="gestures-card__text">
              Chuột: rê để nổi lên, nhấn để lún xuống. Bàn phím: Tab tới thẻ rồi nhấn Enter hoặc
              Space.
            </span>
          </motion.button>
        </section>

        <section className="gestures-section" aria-labelledby="gestures-drag-label">
          <h2 className="gestures-heading" id="gestures-drag-label">
            Ô kéo trong khung
          </h2>
          <div className="gestures-drag-frame" ref={frameRef}>
            <motion.div
              className="gestures-drag-box"
              aria-hidden="true"
              drag
              dragConstraints={frameRef}
              dragElastic={reduce ? 0 : 0.18}
              dragMomentum={!reduce}
              whileDrag={reduce ? { cursor: 'grabbing' } : { scale: 1.03, cursor: 'grabbing' }}
              style={{ x, y }}
              onDragStart={() => setDragging(true)}
              onDragEnd={() => setDragging(false)}
              onDragTransitionEnd={settleDrag}
            >
              <span className="gestures-drag-box__title">Kéo tôi</span>
              <span className="gestures-drag-box__hint">trong khung</span>
            </motion.div>
          </div>
          <div className="demo-row">
            <button className="demo-button" type="button" onClick={resetDrag}>
              Đưa về chỗ cũ
            </button>
            <span className="demo-hint">
              {reduce
                ? 'Giảm chuyển động: không elastic, thả ra là dừng.'
                : 'Kéo quá mép sẽ đàn hồi lại.'}
            </span>
          </div>
        </section>
      </div>

      <p className="demo-output" role="status">
        {cardStatus} {dragStatus}
      </p>

      <p className="demo-hint">
        {reduce
          ? 'Đang giảm chuyển động: thẻ đổi độ mờ thay vì scale, ô kéo không scale hay elastic và về gốc ngay. Trạng thái vẫn hiện đầy đủ ở dòng trên.'
          : 'Thẻ dùng whileHover/whileTap, ô kéo dùng drag với dragConstraints và dragElastic. Nút “Đưa về chỗ cũ” là đường bàn phím cho thao tác kéo; thông tin luôn có trong dòng trạng thái.'}
      </p>
    </div>
  );
}
