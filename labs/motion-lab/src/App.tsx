import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
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

const findPlaygroundPreset = (route: string): string | undefined => {
  const match = /^\/playground(?:\/([^/]+))?$/.exec(route);
  return match ? match[1] : undefined;
};

const isPlaygroundRoute = (route: string): boolean => /^\/playground(?:\/[^/]+)?$/.test(route);

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
        <ThemeSwitch />
      </nav>
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
        onPointerEnter={() => {
          replay();
          void demo.load();
        }}
        onFocus={() => {
          replay();
          void demo.load();
        }}
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

const App = () => {
  const route = useHashRoute();
  const playground = isPlaygroundRoute(route);
  const playgroundPreset = findPlaygroundPreset(route);
  const demo = playground ? undefined : findDemo(route);
  const demoNode = demo ? (demoNodes.get(demo.id) ?? null) : null;

  useEffect(() => {
    globalThis.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    document.title = playground
      ? 'Playground — Motion Lab'
      : demo
        ? `${demo.title} — Motion Lab`
        : 'Motion Lab — Dev Lab';
  }, [demo, playground]);

  return (
    <div className="app">
      <Backdrop />
      <Header active={playground ? 'playground' : 'demo'} />

      <main className="main">
        {playground ? (
          <DemoBoundary>
            <Suspense fallback={<p className="demo-loading">Đang tải playground…</p>}>
              <PlaygroundPage initialPreset={playgroundPreset} />
            </Suspense>
          </DemoBoundary>
        ) : demo && demoNode ? (
          <DemoPage demo={demo}>
            <DemoBoundary key={demo.id}>
              <Suspense fallback={<p className="demo-loading">Đang tải demo…</p>}>
                {demoNode}
              </Suspense>
            </DemoBoundary>
          </DemoPage>
        ) : (
          <IndexPage />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
