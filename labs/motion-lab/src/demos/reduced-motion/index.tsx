import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './styles.css';

export default function ReducedMotionDemo() {
  // The real preference from the operating system.
  const systemReduce = useReducedMotion();
  // Demo-only switch, so both modes can be compared without touching the OS setting.
  const [simulated, setSimulated] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [runs, setRuns] = useState(0);

  const reduce = systemReduce || simulated;
  const systemLabel = systemReduce ? 'giảm' : 'không giảm';
  const modeLabel = reduce ? 'giảm chuyển động' : 'chuyển động đầy đủ';

  const runAnimation = () => {
    setAtEnd((value) => !value);
    setRuns((value) => value + 1);
  };

  const status =
    runs === 0
      ? `Chưa chạy lần nào. Đang áp dụng: ${modeLabel}. Bấm "Chạy animation" để so sánh.`
      : reduce
        ? `Lần ${runs}: giảm chuyển động — ô đổi vị trí ngay lập tức (duration 0), không trượt. Vị trí và nhãn vẫn cho biết trạng thái.`
        : `Lần ${runs}: chuyển động đầy đủ — ô trượt sang vị trí mới bằng spring (stiffness 220, damping 22).`;

  return (
    <div className="reduced-motion-demo">
      <div className="demo-row">
        <span className="chip">
          Hệ thống: <strong className="reduced-motion-value">{systemLabel}</strong>
        </span>
        <span className={reduce ? 'chip reduced-motion-chip--reduce' : 'chip'}>
          Đang áp dụng: <strong className="reduced-motion-value">{modeLabel}</strong>
        </span>
      </div>

      <div className="reduced-motion-track" aria-hidden="true">
        <motion.div
          className="reduced-motion-box"
          initial={false}
          animate={{ x: atEnd ? '100%' : '0%' }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
        />
      </div>

      <div className="demo-row">
        <button className="demo-button" type="button" onClick={runAnimation}>
          Chạy animation
        </button>
        <button
          className="demo-button"
          type="button"
          aria-pressed={simulated}
          onClick={() => setSimulated((value) => !value)}
        >
          Mô phỏng giảm chuyển động
        </button>
      </div>

      <p className="demo-output" role="status">
        {status}
      </p>
      <p className="demo-hint">
        Chip “Hệ thống” đọc <code>useReducedMotion()</code> từ <code>motion/react</code>. Nút mô
        phỏng cho phép xem cả hai chế độ ngay trong demo, không phụ thuộc setting của OS.
      </p>
    </div>
  );
}
