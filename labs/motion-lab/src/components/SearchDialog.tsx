import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { demoGroups, demos, type DemoGroup } from '../demos/registry';
import { normalizeSearchText, searchLabEntries, type LabSearchEntry } from '../lib/search';

const IS_MAC =
  typeof globalThis.navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(globalThis.navigator.userAgent);
const SHORTCUT = IS_MAC ? '⌘ K' : 'Ctrl K';

const groupLabel = (group: DemoGroup): string =>
  demoGroups.find((item) => item.id === group)?.label ?? group;

const makeEntry = (data: Omit<LabSearchEntry, 'text'>, extra = ''): LabSearchEntry => ({
  ...data,
  text: normalizeSearchText([data.title, data.summary, data.type, data.meta, extra].join(' ')),
});

/**
 * The index is built from the demo metadata that is already eager, so search
 * costs no extra network request and never goes stale. Pitfalls are part of the
 * haystack: a reader searching "drag" should find the gesture demo even when the
 * word is not in its title or summary.
 */
const SEARCH_ENTRIES: LabSearchEntry[] = [
  ...demos.map((demo) =>
    makeEntry(
      {
        id: `demo-${demo.id}`,
        title: demo.title,
        type: groupLabel(demo.group),
        meta: demo.api.join(' · '),
        summary: demo.summary,
        href: `#/demos/${demo.id}`,
      },
      demo.pitfalls.join(' '),
    ),
  ),
  makeEntry({
    id: 'playground',
    title: 'Playground',
    type: 'Trang',
    meta: 'snippet · animate · stagger · spring',
    summary: 'Sửa snippet motion và xem thay đổi ngay trên stage.',
    href: '#/playground',
  }),
  makeEntry({
    id: 'demo-index',
    title: 'Tất cả demo',
    type: 'Trang',
    meta: 'danh sách · lọc theo nhóm',
    summary: `${demos.length} demo motion, lọc theo nhóm và mở từng demo.`,
    href: '#/',
  }),
];

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="5.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="m12.5 12.5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const isEditable = (target: EventTarget | null): boolean =>
  target instanceof Element &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

export const Search = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchLabEntries(SEARCH_ENTRIES, query, 8), [query]);
  const activeEntry = results[active];
  const activeId = activeEntry ? `search-option-${active}` : undefined;

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    setQuery('');
    setActive(0);
    dialog.showModal();
    setOpen(true);
    inputRef.current?.focus();
  }, []);

  const choose = useCallback(
    (entry: LabSearchEntry) => {
      globalThis.location.hash = entry.href.replace(/^#/, '');
      close();
    },
    [close],
  );

  // Lock the page behind the modal and focus the field; native <dialog> keeps
  // the rest of the document inert.
  useEffect(() => {
    if (!open) {
      return;
    }

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    inputRef.current?.focus();

    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    // Clicks on the dialog element itself are clicks on the backdrop area; the
    // panel stops them. A native listener keeps the JSX free of a click handler
    // on a non-interactive element.
    const onBackdropClick = (event: globalThis.MouseEvent) => {
      if (event.target === dialog) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', onBackdropClick);

    return () => dialog.removeEventListener('click', onBackdropClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openDialog();
        return;
      }

      if (event.key === '/' && !isEditable(event.target)) {
        event.preventDefault();
        openDialog();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openDialog]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.getElementById(`search-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, query]);

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (results.length === 0) {
        return;
      }

      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + results.length) % results.length);
      return;
    }

    if (event.key === 'Enter' && activeEntry) {
      event.preventDefault();
      choose(activeEntry);
    }
  };

  const status = query.trim() ? `${results.length} kết quả.` : `${results.length} gợi ý.`;

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        aria-label={`Tìm kiếm (${SHORTCUT})`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openDialog}
      >
        <SearchIcon />
        <span className="search-trigger__label" aria-hidden="true">
          tìm
        </span>
        <kbd className="search-trigger__kbd" aria-hidden="true">
          {SHORTCUT}
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-labelledby="search-title"
        onClose={() => {
          setOpen(false);
          setQuery('');
          setActive(0);
        }}
      >
        <div className="search-dialog__panel">
          <h2 id="search-title" className="visually-hidden">
            Tìm kiếm
          </h2>

          <div className="search-dialog__bar">
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              className="search-dialog__input"
              placeholder="Tìm demo, API, lỗi thường gặp…"
              autoComplete="off"
              spellCheck={false}
              role="combobox"
              aria-controls="search-results"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-activedescendant={activeId}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
            />
            <button
              type="button"
              className="search-dialog__close"
              aria-label="Đóng tìm kiếm"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>

          <div
            id="search-results"
            className="search-dialog__results"
            role="listbox"
            aria-label="Kết quả tìm kiếm"
          >
            {results.map((entry, index) => (
              <a
                key={entry.id}
                id={`search-option-${index}`}
                className="search-result"
                href={entry.href}
                role="option"
                aria-selected={index === active}
                data-active={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={close}
              >
                <span className="search-result__type">{entry.type}</span>
                <span className="search-result__title">{entry.title}</span>
                <span className="search-result__meta">{entry.meta}</span>
              </a>
            ))}
          </div>

          {results.length === 0 ? (
            <p className="search-dialog__empty">Không tìm thấy kết quả phù hợp.</p>
          ) : null}

          <p className="visually-hidden" role="status" aria-live="polite">
            {status}
          </p>

          <div className="search-dialog__footer">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> di chuyển
            </span>
            <span>
              <kbd>↵</kbd> mở
            </span>
            <span>
              <kbd>esc</kbd> đóng
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
};
