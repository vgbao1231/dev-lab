import { useRef, useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import './styles.css';

type Step = {
  api: string;
  text: string;
};

const STEPS: Step[] = [
  {
    api: 'viewport.root',
    text: 'Khung cuộn này là root; observer chỉ tính những mục nằm trong nó, không tính cả trang.',
  },
  {
    api: 'whileInView',
    text: 'Mục chạy tới trạng thái đích mỗi lần được xem là “trong khung nhìn”.',
  },
  {
    api: 'viewport.amount',
    text: 'Mục phải lộ ít nhất 40% diện tích thì mới được tính là đã vào khung.',
  },
  {
    api: 'viewport.once',
    text: 'Bật “chỉ một lần” thì mục đã reveal sẽ không chạy lại khi cuộn ngược lên.',
  },
  {
    api: 'onViewportEnter',
    text: 'Callback chạy khi mục vào khung — dùng để đếm, log hoặc đồng bộ state.',
  },
  {
    api: 'initial',
    text: 'Trạng thái ẩn ban đầu; dưới reduced motion nó bị bỏ để nội dung hiện ngay.',
  },
  {
    api: 'transition',
    text: 'Spring cho cảm giác tự nhiên; reduced motion đặt duration 0 thay vì bỏ hẳn phản hồi.',
  },
];

const REVEAL: Transition = { type: 'spring', stiffness: 220, damping: 26 };
const INSTANT: Transition = { duration: 0 };

export default function WhileInViewDemo() {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [once, setOnce] = useState(true);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set<string>());

  const markSeen = (api: string) => {
    setSeen((previous) => new Set(previous).add(api));
  };

  const reset = () => {
    setSeen(new Set<string>());
    scrollerRef.current?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  const mode = once
    ? 'once: true — mỗi mục chỉ chạy lần đầu'
    : 'once: false — cuộn lại để xem chạy lại';
  const status = `${seen.size} / ${STEPS.length} mục đã vào khung. ${mode}.${
    reduce ? ' Giảm chuyển động: nội dung hiện ngay, không trượt.' : ''
  }`;

  return (
    <div className="while-in-view-demo">
      <div className="demo-row">
        <button
          className="demo-button"
          type="button"
          aria-pressed={once}
          onClick={() => setOnce((value) => !value)}
        >
          {once ? 'Chỉ một lần' : 'Mỗi lần vào khung'}
        </button>
        <button className="demo-button" type="button" onClick={reset}>
          Về đầu &amp; đếm lại
        </button>
      </div>

      <div
        className="while-in-view-viewport"
        ref={scrollerRef}
        // A scrollable region must be focusable so it can be scrolled with the
        // arrow keys (WAI-ARIA "scrollable region" pattern).
        // eslint-disable-next-line jsx-a11y-x/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label="Khung cuộn thử reveal"
      >
        <ul className="while-in-view-track">
          {STEPS.map((step, index) => (
            <motion.li
              className="while-in-view-row"
              key={step.api}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: scrollerRef, once, amount: 0.4 }}
              transition={reduce ? INSTANT : REVEAL}
              onViewportEnter={() => markSeen(step.api)}
            >
              <span className="while-in-view-row__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <code className="while-in-view-row__api">{step.api}</code>
              <span className="while-in-view-row__text">{step.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="demo-output" role="status">
        {status}
      </p>

      <p className="demo-hint">
        Focus vào khung rồi cuộn bằng phím mũi tên, hoặc cuộn bằng chuột. Đổi nút “Chỉ một lần” rồi
        bấm “Về đầu &amp; đếm lại” để so sánh: <code>once</code> quyết định mục có chạy lại hay
        không, còn <code>amount</code> quyết định mục phải lộ bao nhiêu phần trăm.
      </p>
    </div>
  );
}
