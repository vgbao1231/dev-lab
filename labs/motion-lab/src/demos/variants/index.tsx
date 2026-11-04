import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import './styles.css';

type Step = {
  api: string;
  text: string;
};

const steps: Step[] = [
  { api: 'initial', text: 'Parent khai báo trạng thái đầu; các con thừa hưởng tên variant.' },
  { api: 'animate', text: 'Đổi tên trạng thái đích là cả nhóm chuyển theo.' },
  { api: 'delayChildren', text: 'Parent chờ 150 ms rồi mới cho các con bắt đầu.' },
  { api: 'staggerChildren', text: 'Mỗi con trễ thêm 90 ms so với con trước.' },
];

export default function VariantsDemo() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);

  // Reduced motion keeps the state change but collapses the whole schedule to
  // zero, so the list still appears and disappears, just without the slide.
  const timing = reduce
    ? { stagger: 0, delay: 0, duration: 0 }
    : { stagger: 0.09, delay: 0.15, duration: 0.35 };

  const list: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: timing.delay, staggerChildren: timing.stagger } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 14, transition: { duration: timing.duration } },
    visible: { opacity: 1, y: 0, transition: { duration: timing.duration } },
  };

  const status = !open
    ? 'Đang ở “hidden”: các mục đã ẩn. Bấm “Mở danh sách” để xem lại nhịp so le.'
    : reduce
      ? 'Đang ở “visible”: giảm chuyển động nên 4 mục hiện ngay, không trễ và không so le.'
      : 'Đang ở “visible”: 4 mục vào so le (delay 150 ms, stagger 90 ms).';

  return (
    <div className="variants-demo">
      <div className="variants-bar">
        <span className="chip">
          Trạng thái: <code className="variants-value">{open ? 'visible' : 'hidden'}</code>
        </span>
        <button className="demo-button" type="button" onClick={() => setOpen((value) => !value)}>
          {open ? 'Ẩn danh sách' : 'Mở danh sách'}
        </button>
      </div>

      <motion.ul
        className="variants-list"
        role="list"
        variants={list}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
      >
        {steps.map((step, index) => (
          <motion.li className="variants-item" key={step.api} variants={item}>
            <span className="variants-item__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <code className="variants-item__api">{step.api}</code>
            <span className="variants-item__text">{step.text}</span>
          </motion.li>
        ))}
      </motion.ul>

      <p className="demo-output" role="status">
        {status}
      </p>

      <p className="demo-hint">
        Parent khai báo tên trạng thái, con nhận cùng tên qua <code>variants</code>. Nút đổi{' '}
        <code>animate</code> để xem cả hai chiều; khi hệ thống bật giảm chuyển động, các mục đổi
        trạng thái ngay.
      </p>
    </div>
  );
}
