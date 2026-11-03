import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { DemoBoundary } from './demos/DemoBoundary';
import { demoGroups, demos, type Demo } from './demos/registry';
import { useHashRoute } from './lib/useHashRoute';

// Placeholder until the portal has a stable custom domain.
const PORTAL_URL = 'https://dev-lab-gura.pages.dev';

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

const DemoPage = ({ demo, children }: { demo: Demo; children: ReactNode }) => {
  const group = demoGroups.find((candidate) => candidate.id === demo.group);

  return (
    <article className="demo-page">
      <a className="back-link" href="#/">
        ← Tất cả demo
      </a>
      <p className="kicker">{group?.label ?? 'Demo'}</p>
      <h1>{demo.title}</h1>
      <p className="lead">{demo.summary}</p>

      <div className="demo-stage">{children}</div>

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
    </article>
  );
};

const IndexPage = () => (
  <>
    <section className="hero">
      <p className="kicker">Dev Lab · Lab 02</p>
      <h1>Motion Lab</h1>
      <p className="lead">
        Demo các kiểu chuyển động, cách dùng API và những chỗ dễ sai. Mỗi demo là một module riêng:
        chỉ demo bạn mở mới được tải.
      </p>
    </section>

    {demos.length === 0 ? (
      <p className="demo-hint">
        Các demo đang được viết. Mỗi demo xuất hiện ở đây khi thư mục của nó có{' '}
        <code>index.tsx</code>.
      </p>
    ) : null}

    {demoGroups.map((group) => {
      const items = demos.filter((demo) => demo.group === group.id);
      if (items.length === 0) return null;

      return (
        <section key={group.id} className="group" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`}>{group.label}</h2>
          <ul className="demo-list">
            {items.map((demo) => (
              <li key={demo.id}>
                <a
                  className="demo-card"
                  href={`#/demos/${demo.id}`}
                  onPointerEnter={() => void demo.load()}
                  onFocus={() => void demo.load()}
                >
                  <span className="demo-card__title">{demo.title}</span>
                  <span className="demo-card__summary">{demo.summary}</span>
                  <span className="demo-card__api">{demo.api.slice(0, 3).join(' · ')}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      );
    })}
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
      <header className="site-header">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true" />
          Motion Lab
        </a>
        <a className="portal-link" href={PORTAL_URL}>
          Dev Lab <span aria-hidden="true">↗</span>
        </a>
      </header>

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

      <footer className="footer">
        <p>Motion Lab · một lab của Dev Lab</p>
        <p className="footer__note">Demo-first, static, không backend.</p>
      </footer>
    </div>
  );
};

export default App;
