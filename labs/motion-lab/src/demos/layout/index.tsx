import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import './styles.css';

type LayoutItem = { id: string; label: string };

const MAX_ITEMS = 8;

const INITIAL_ITEMS: LayoutItem[] = [
  { id: 'muc-1', label: 'Mục 1' },
  { id: 'muc-2', label: 'Mục 2' },
  { id: 'muc-3', label: 'Mục 3' },
  { id: 'muc-4', label: 'Mục 4' },
];

/** Fisher–Yates shuffle that always changes the order when there is more than one item. */
const shuffleItems = (items: LayoutItem[]): LayoutItem[] => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    const other = next[swapIndex];
    if (!current || !other) continue;
    next[index] = other;
    next[swapIndex] = current;
  }

  const unchanged = next.every((item, index) => item.id === items[index]?.id);
  if (unchanged && next.length > 1) {
    const first = next.shift();
    if (first) next.push(first);
  }

  return next;
};

export default function LayoutDemo() {
  const reducedMotion = useReducedMotion();
  const [items, setItems] = useState<LayoutItem[]>(INITIAL_ITEMS);
  const sequence = useRef(INITIAL_ITEMS.length);

  const addItem = () => {
    if (items.length >= MAX_ITEMS) return;
    sequence.current += 1;
    const nextItem: LayoutItem = {
      id: `muc-${sequence.current}`,
      label: `Mục ${sequence.current}`,
    };
    setItems((current) => (current.length >= MAX_ITEMS ? current : [...current, nextItem]));
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const shuffle = () => {
    setItems((current) => (current.length < 2 ? current : shuffleItems(current)));
  };

  const reset = () => {
    setItems([...INITIAL_ITEMS]);
  };

  const canAdd = items.length < MAX_ITEMS;
  const canShuffle = items.length > 1;

  return (
    <div className="layout-demo">
      <div className="demo-row">
        <button type="button" className="demo-button" onClick={addItem} disabled={!canAdd}>
          Thêm mục
        </button>
        <button type="button" className="demo-button" onClick={shuffle} disabled={!canShuffle}>
          Xáo trộn
        </button>
        <p className="demo-output" role="status">
          {items.length} / {MAX_ITEMS} mục
        </p>
      </div>

      <ul className="layout-list">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              className="layout-item"
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
              transition={
                reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
              }
            >
              <span className="layout-item__label">{item.label}</span>
              <button
                type="button"
                className="layout-item__remove"
                onClick={() => removeItem(item.id)}
                aria-label={`Xóa ${item.label}`}
              >
                <span aria-hidden="true">×</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {items.length === 0 ? (
        <div className="layout-empty">
          <p className="demo-hint">
            Danh sách trống. Thêm một mục mới hoặc khôi phục danh sách ban đầu.
          </p>
          <button type="button" className="demo-button" onClick={reset}>
            Khôi phục danh sách
          </button>
        </div>
      ) : null}

      <p className="demo-hint">
        {reducedMotion ? (
          <>
            Đang giảm chuyển động: thêm, xóa và xáo trộn đổi bố cục ngay, không trượt. Số mục và
            danh sách vẫn cập nhật đầy đủ.
          </>
        ) : (
          <>
            Thêm, xóa hoặc xáo trộn: các mục trượt sang vị trí mới nhờ <code>layout</code>, mục mới
            vào và ra qua <code>AnimatePresence</code>.
          </>
        )}
      </p>
    </div>
  );
}
