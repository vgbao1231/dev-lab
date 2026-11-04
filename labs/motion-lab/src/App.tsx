import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { DemoBoundary } from './demos/DemoBoundary';
import { demoGroups, demos, type Demo } from './demos/registry';
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

const findDemo = (route: string): Demo | undefined => {
  const match = /^\/demos\/([^/]+)$/.exec(route);
  const id = match?.[1];
  return id ? demos.find((demo) => demo.id === id) : undefined;
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

const Header = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="brand" href="#/">
        <span className="brand__mark" aria-hidden="true" />
        <span>
          Motion Lab<span className="brand__dot">.</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Điều hướng chính">
        <a className="site-nav__link" href="#/">
          demo
        </a>
        <a className="site-nav__link" href={PORTAL_URL}>
          Dev Lab ↗
        </a>
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
      </section>

      <DemoPager index={index} />
    </article>
  );
};

const IndexPage = () => (
  <>
    <section className="hero">
      <p className="kicker">Dev Lab · lab 02</p>
      <h1>Motion Lab</h1>
      <p className="lead">
        Demo các kiểu chuyển động, cách dùng API và những chỗ dễ sai. Mỗi demo là một module riêng:
        chỉ demo bạn mở mới được tải.
      </p>
      <p className="mono hero__meta">{pad(demos.length)} demo · React 19 · Motion · static</p>
    </section>

    {demos.length > 0 ? (
      <ul className="demo-list">
        {demos.map((demo, index) => (
          <li key={demo.id}>
            <a
              className="demo-card"
              href={`#/demos/${demo.id}`}
              onPointerEnter={() => void demo.load()}
              onFocus={() => void demo.load()}
            >
              <span className="demo-card__meta">
                <span className="demo-card__group">
                  {demoGroups.find((group) => group.id === demo.group)?.label ?? 'Demo'}
                </span>
                <span className="demo-card__index">{pad(index + 1)}</span>
              </span>
              <span className="demo-card__title">{demo.title}</span>
              <span className="demo-card__summary">{demo.summary}</span>
              <span className="demo-card__api">{demo.api.slice(0, 3).join(' · ')}</span>
            </a>
          </li>
        ))}
      </ul>
    ) : (
      <p className="demo-hint">
        Các demo đang được viết. Mỗi demo xuất hiện ở đây khi thư mục của nó có{' '}
        <code>index.tsx</code>.
      </p>
    )}
  </>
);

const App = () => {
  const route = useHashRoute();
  const demo = findDemo(route);
  const demoNode = demo ? (demoNodes.get(demo.id) ?? null) : null;

  useEffect(() => {
    globalThis.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    document.title = demo ? `${demo.title} — Motion Lab` : 'Motion Lab — Dev Lab';
  }, [demo]);

  return (
    <div className="app">
      <Header />

      <main className="main">
        {demo && demoNode ? (
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
