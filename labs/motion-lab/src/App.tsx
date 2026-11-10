import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { Backdrop } from './components/Backdrop';
import { DemoPreview } from './components/DemoPreview';
import { Search } from './components/SearchDialog';
import { DemoBoundary } from './demos/DemoBoundary';
import { demoGroups, demos, type Demo } from './demos/registry';
import type { DemoGroup } from './demos/types';
import { useHashRoute } from './lib/useHashRoute';
import { useTheme, type ThemeMode } from './lib/useTheme';

// Placeholder until the portal has a stable custom domain.
const PORTAL_URL = 'https://dev-lab-gura.pages.dev';
const SOURCE_URL = 'https://github.com/vgbao1231/dev-lab/tree/main/labs/motion-lab';
const BASE_DESCRIPTION = 'Demo các kiểu chuyển động, cách dùng API và cạm bẫy khi làm motion.';

const THEME_OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'dark', label: 'tối' },
  { mode: 'light', label: 'sáng' },
  { mode: 'system', label: 'hệ thống' },
];

const pad = (value: number): string => String(value).padStart(2, '0');

// `lazy` only calls `load` when the component first renders, so wrapping every
// demo here is still lazy: nothing outside the opened demo is downloaded. The
// elements are created once at module scope so no component is created during
// render (react-hooks/static-components).
const demoNodes = new Map<string, ReactNode>(
  demos.map((demo) => {
    const DemoComponent = lazy(demo.load);
    return [demo.id, <DemoComponent key={demo.id} />];
  }),
);

const PlaygroundPage = lazy(() => import('./playground/PlaygroundPage'));

const findDemo = (route: string): Demo | undefined => {
  const match = /^\/demos\/([^/]+)$/.exec(route);
  const id = match?.[1];
  return id ? demos.find((demo) => demo.id === id) : undefined;
};

type Route =
  | { kind: 'index' }
  | { kind: 'demo'; demo: Demo }
  | { kind: 'playground'; preset?: string }
  | { kind: 'not-found'; route: string };

const resolveRoute = (route: string): Route => {
  if (route === '' || route === '/') {
    return { kind: 'index' };
  }

  const playground = /^\/playground(?:\/([^/]+))?$/.exec(route);

  if (playground) {
    return { kind: 'playground', preset: playground[1] };
  }

  const demo = findDemo(route);

  return demo ? { kind: 'demo', demo } : { kind: 'not-found', route };
};

const ThemeSwitch = () => {
  const [mode, setMode] = useTheme();

  return (
    <div className="theme-switch" role="group" aria-label="Chế độ màu">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.mode}
          type="button"
          className="theme-switch__option"
          aria-pressed={mode === option.mode}
          onClick={() => setMode(option.mode)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

type HeaderProps = { active: 'demo' | 'playground' };

const Header = ({ active }: HeaderProps) => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="brand" href="#/">
        <span className="brand__mark" aria-hidden="true" />
        <span>
          Motion Lab<span className="brand__dot">.</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Điều hướng chính">
        <a
          className="site-nav__link"
          href="#/"
          aria-current={active === 'demo' ? 'page' : undefined}
        >
          demo
        </a>
        <a
          className="site-nav__link"
          href="#/playground"
          aria-current={active === 'playground' ? 'page' : undefined}
        >
          playground
        </a>
        <a className="site-nav__link" href={PORTAL_URL}>
          Dev Lab ↗
        </a>
        <Search />
      </nav>
      <ThemeSwitch />
    </div>
  </header>
);

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <p>© {new Date().getFullYear()} Dev Lab</p>
      <p>
        <a href={PORTAL_URL}>portal ↗</a> · <a href={SOURCE_URL}>mã nguồn ↗</a> · motion-lab, 1
        trong các lab
      </p>
    </div>
  </footer>
);

const DemoPager = ({ index }: { index: number }) => {
  const previous = demos[index - 1];
  const next = demos[index + 1];

  return (
    <nav className="demo-pager" aria-label="Demo kế tiếp">
      {previous ? (
        <a href={`#/demos/${previous.id}`}>
          ← {pad(index)} · {previous.id}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={`#/demos/${next.id}`}>
          {pad(index + 2)} · {next.id} →
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
};

const DemoPage = ({ demo, children }: { demo: Demo; children: ReactNode }) => {
  const index = demos.findIndex((candidate) => candidate.id === demo.id);
  const group = demoGroups.find((candidate) => candidate.id === demo.group);

  return (
    <article className="demo-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#/">demo</a>
          </li>
          <li aria-current="page">{demo.id}</li>
        </ol>
        <span className="crumbs__count">
          {pad(index + 1)} / {pad(demos.length)} · {group?.label ?? 'demo'}
        </span>
      </nav>

      <h1>{demo.title}</h1>
      <p className="lead">{demo.summary}</p>

      <section className="stage" aria-label={`Stage của demo ${demo.id}`}>
        <div className="stage__bar mono">
          <span>stage · {demo.id}</span>
          <span>
            {pad(index + 1)} / {pad(demos.length)}
          </span>
        </div>
        <div className="stage__body">{children}</div>
      </section>

      <div className="notes">
        <section className="notes__column" aria-labelledby="notes-api">
          <h2 id="notes-api">API chính</h2>
          <ul className="api-list">
            {demo.api.map((item) => (
              <li key={item}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </section>
        <section className="notes__column" aria-labelledby="notes-pitfalls">
          <h2 id="notes-pitfalls">Cạm bẫy</h2>
          <ul className="pitfall-list">
            {demo.pitfalls.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="code-section" aria-labelledby="notes-code">
        <h2 id="notes-code">Đoạn code chính</h2>
        <pre className="code-block">
          <code>{demo.code}</code>
        </pre>
        <p className="demo-playground-link">
          <a className="demo-button" href={`#/playground/${demo.id}`}>
            Nghịch snippet trong playground →
          </a>
        </p>
      </section>

      <DemoPager index={index} />
    </article>
  );
};

const DemoCard = ({ demo, index }: { demo: Demo; index: number }) => {
  const [playKey, setPlayKey] = useState(0);
  const cardRef = useRef<HTMLLIElement>(null);

  // Hover and focus replay the card preview by remounting it, so the animation
  // starts from its first frame instead of finishing once and staying still.
  const replay = () => setPlayKey((value) => value + 1);

  // Warm the demo chunk as soon as intent is visible. A failed preload is not
  // fatal: the demo page has its own boundary for the real render.
  const preload = () => {
    replay();
    demo.load().catch(() => undefined);
  };

  // Cards below the fold finish their one-shot animation before the reader sees
  // them. Replay once when the card first enters the viewport, then stop
  // observing: the preview still never loops and never runs on a timer.
  useEffect(() => {
    const node = cardRef.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlayKey((value) => value + 1);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <li ref={cardRef}>
      <a
        className="demo-card"
        href={`#/demos/${demo.id}`}
        onPointerEnter={preload}
        onFocus={preload}
      >
        <DemoPreview key={playKey} kind={demo.preview} />
        <span className="demo-card__body">
          <span className="demo-card__meta">
            <span className="demo-card__group">
              {demoGroups.find((group) => group.id === demo.group)?.label ?? 'Demo'}
            </span>
            <span className="demo-card__index">{pad(index + 1)}</span>
          </span>
          <span className="demo-card__title">{demo.title}</span>
          <span className="demo-card__summary">{demo.summary}</span>
          <span className="demo-card__api">{demo.api.slice(0, 3).join(' · ')}</span>
        </span>
      </a>
    </li>
  );
};

const IndexPage = () => {
  const [filter, setFilter] = useState<DemoGroup | 'all'>('all');
  const visible = filter === 'all' ? demos : demos.filter((demo) => demo.group === filter);

  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <p className="kicker">Dev Lab · lab 02</p>
          <h1>Motion Lab</h1>
          <p className="lead">
            Demo các kiểu chuyển động, cách dùng API và những chỗ dễ sai. Mỗi demo là một module
            riêng: chỉ demo bạn mở mới được tải.
          </p>
          <p className="hero__actions">
            <a className="hero__cta" href="#/playground">
              Mở playground →
            </a>
          </p>
        </div>

        <dl className="hero__spec" aria-label="Thông số của lab">
          <div className="hero__spec-row">
            <dt>demo</dt>
            <dd>{pad(demos.length)}</dd>
          </div>
          <div className="hero__spec-row">
            <dt>nhóm</dt>
            <dd>{pad(demoGroups.length)}</dd>
          </div>
          <div className="hero__spec-row">
            <dt>stack</dt>
            <dd>React 19 · motion</dd>
          </div>
          <div className="hero__spec-row">
            <dt>tải</dt>
            <dd>theo từng demo</dd>
          </div>
        </dl>
      </section>

      {demos.length > 0 ? (
        <>
          <div className="filters" role="group" aria-label="Lọc demo theo nhóm">
            <button
              type="button"
              className="filter"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              tất cả
            </button>
            {demoGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className="filter"
                aria-pressed={filter === group.id}
                onClick={() => setFilter(group.id)}
              >
                {group.label}
              </button>
            ))}
            <span className="filters__count" role="status">
              {pad(visible.length)} demo
            </span>
          </div>

          <ul className="demo-list">
            {visible.map((demo) => (
              <DemoCard key={demo.id} demo={demo} index={demos.indexOf(demo)} />
            ))}
          </ul>
        </>
      ) : (
        <p className="demo-hint">
          Các demo đang được viết. Mỗi demo xuất hiện ở đây khi thư mục của nó có{' '}
          <code>index.tsx</code>.
        </p>
      )}
    </>
  );
};

const NotFoundPage = ({ route }: { route: string }) => {
  const missingDemo = /^\/demos\/[^/]+\/?$/.test(route);

  return (
    <article className="demo-page not-found">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#/">demo</a>
          </li>
          <li aria-current="page">không tìm thấy</li>
        </ol>
      </nav>

      <h1>{missingDemo ? 'Demo không tồn tại' : 'Không tìm thấy trang'}</h1>
      <p className="lead">
        {missingDemo
          ? 'Địa chỉ này không khớp demo nào trong lab. Có thể demo đã đổi tên hoặc link đã cũ.'
          : 'Địa chỉ này không khớp trang nào trong Motion Lab.'}
      </p>
      <p className="not-found__route">
        <code>{`#${route}`}</code>
      </p>

      <p className="demo-playground-link">
        <a className="demo-button" href="#/">
          Về danh sách demo →
        </a>
      </p>
      <p className="demo-hint">
        Mẹo: <kbd>Ctrl/⌘ + K</kbd> mở tìm kiếm trên toàn bộ demo và playground.
      </p>
    </article>
  );
};

const App = () => {
  const route = useHashRoute();
  const current = resolveRoute(route);
  const playground = current.kind === 'playground';
  const demo = current.kind === 'demo' ? current.demo : undefined;
  const demoNode = demo ? (demoNodes.get(demo.id) ?? null) : null;
  const missingRoute =
    current.kind === 'not-found'
      ? current.route
      : current.kind === 'demo' && !demoNode
        ? `/demos/${current.demo.id}`
        : undefined;

  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  const pageTitle =
    current.kind === 'demo'
      ? `${current.demo.title} — Motion Lab`
      : current.kind === 'playground'
        ? 'Playground — Motion Lab'
        : current.kind === 'not-found'
          ? 'Không tìm thấy — Motion Lab'
          : 'Motion Lab — Dev Lab';

  const description =
    current.kind === 'demo'
      ? `${current.demo.title}: ${current.demo.summary}`
      : current.kind === 'playground'
        ? 'Sửa snippet motion và xem thay đổi ngay trên stage của Motion Lab.'
        : BASE_DESCRIPTION;

  // Hash navigation does not reload the document, so the new page needs its own
  // scroll position, title and description. Focus moves to <main> only after a
  // real route change: on first load the browser keeps its normal focus position.
  useEffect(() => {
    globalThis.scrollTo(0, 0);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  useEffect(() => {
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [description, pageTitle]);

  const skipToContent = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    // A plain `href="#main"` would change the hash route to /main, so the
    // skip link moves focus itself instead of navigating.
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Bỏ qua tới nội dung
      </a>
      <Backdrop />
      <Header active={playground ? 'playground' : 'demo'} />

      <main id="main" className="main" tabIndex={-1} ref={mainRef}>
        {current.kind === 'playground' ? (
          <DemoBoundary>
            <Suspense fallback={<p className="demo-loading">Đang tải playground…</p>}>
              <PlaygroundPage key={current.preset ?? 'index'} initialPreset={current.preset} />
            </Suspense>
          </DemoBoundary>
        ) : current.kind === 'demo' && demoNode ? (
          <DemoPage demo={current.demo}>
            <DemoBoundary key={current.demo.id}>
              <Suspense fallback={<p className="demo-loading">Đang tải demo…</p>}>
                {demoNode}
              </Suspense>
            </DemoBoundary>
          </DemoPage>
        ) : missingRoute ? (
          <NotFoundPage route={missingRoute} />
        ) : (
          <IndexPage />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
