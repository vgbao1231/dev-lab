import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { PLAYGROUND_PRESETS, findPreset, type PlaygroundPreset } from './presets';
import { runSnippet, setPlaybackSpeed } from './runSnippet';
import './styles.css';

type PlaygroundStatus = 'idle' | 'running' | 'paused' | 'done' | 'error';

type Props = {
  /** A demo id (`springs`) or a preset id (`spring`) from the hash route. */
  initialPreset?: string;
};

const SPEEDS = [0.25, 0.5, 1, 2] as const;

const STATUS_LABEL: Record<PlaygroundStatus, string> = {
  idle: 'sẵn sàng',
  running: 'đang chạy',
  paused: 'tạm dừng',
  done: 'đã xong',
  error: 'lỗi',
};

const dotsOf = (stage: HTMLElement | null): HTMLElement[] =>
  stage ? Array.from(stage.querySelectorAll<HTMLElement>('.playground__dot')) : [];

export default function PlaygroundPage({ initialPreset }: Props) {
  const systemReduce = useReducedMotion();
  const [preset, setPreset] = useState<PlaygroundPreset>(() => findPreset(initialPreset));
  const [code, setCode] = useState(preset.code);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<PlaygroundStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stageKey, setStageKey] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const goalRef = useRef<HTMLSpanElement>(null);
  const controlsRef = useRef<ReturnType<typeof runSnippet>>([]);
  const speedRef = useRef(1);
  const runIdRef = useRef(0);
  const copiedTimer = useRef<number | undefined>(undefined);
  const tabReleaseRef = useRef(false);
  const pendingRunRef = useRef(false);

  // The lane is measured from its computed insets instead of hard-coded pixels,
  // so the snippet travels edge to edge even if the CSS padding changes. It is
  // re-measured after a remount because the box node is replaced.
  useEffect(() => {
    const lane = laneRef.current;
    const box = boxRef.current;
    const goal = goalRef.current;

    if (!lane || !box) {
      return;
    }

    const measure = () => {
      const boxLeft = Number.parseFloat(getComputedStyle(box).left) || 0;
      const goalRight = goal ? Number.parseFloat(getComputedStyle(goal).right) || 0 : 0;

      setDistance(Math.max(0, lane.clientWidth - box.offsetWidth - boxLeft - goalRight));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(lane);

    return () => observer.disconnect();
  }, [stageKey]);

  const stopAnimations = useCallback(() => {
    runIdRef.current += 1;

    for (const animation of controlsRef.current) {
      animation.stop();
    }

    controlsRef.current = [];
  }, []);

  /**
   * Motion keeps per-element state even after the inline style is cleared, so a
   * second `animate(box, { x: distance })` saw the finished value as both the
   * start and the target and did nothing. Remounting the stage nodes gives every
   * run a fresh element and a fresh Motion state.
   */
  const resetStage = useCallback(() => {
    pendingRunRef.current = false;
    stopAnimations();
    setStageKey((key) => key + 1);
  }, [stopAnimations]);

  const runCode = useCallback(() => {
    pendingRunRef.current = true;
    stopAnimations();
    setStageKey((key) => key + 1);
  }, [stopAnimations]);

  // The run starts after the fresh nodes are committed.
  // The run starts after the fresh nodes are committed. A zero-delay timer keeps
  // the state updates out of the effect body (and still runs in the same tick).
  useEffect(() => {
    if (!pendingRunRef.current) {
      return;
    }

    const box = boxRef.current;

    if (!box || distance <= 0) {
      return;
    }

    const timer = globalThis.setTimeout(() => {
      pendingRunRef.current = false;
      setError(null);
      setPaused(false);

      try {
        const controls = runSnippet(code, {
          box,
          dots: dotsOf(stageRef.current),
          distance,
        });

        setPlaybackSpeed(controls, speedRef.current);

        controlsRef.current = controls;
        setStatus('running');

        const runId = runIdRef.current;
        void Promise.all(controls.map((animation) => animation.finished)).then(
          () => {
            if (runIdRef.current === runId) {
              setStatus('done');
            }
          },
          () => {
            if (runIdRef.current === runId) {
              setStatus('error');
              setError('Animation bị dừng trước khi chạy xong.');
            }
          },
        );
      } catch (cause) {
        setStatus('error');
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    }, 0);

    return () => globalThis.clearTimeout(timer);
  }, [code, distance, stageKey]);

  // The default preset runs once the stage has a width, and every edit re-arms
  // the timer. Under reduced motion the playground stays still until the reader
  // presses "Chạy": the lab should not ignore the OS setting just because this
  // page is about motion.
  useEffect(() => {
    if (systemReduce || distance <= 0) {
      return;
    }

    const timer = globalThis.setTimeout(runCode, 600);
    return () => globalThis.clearTimeout(timer);
  }, [code, distance, runCode, systemReduce]);

  useEffect(() => {
    return () => stopAnimations();
  }, [stopAnimations]);

  useEffect(() => {
    return () => globalThis.clearTimeout(copiedTimer.current);
  }, []);

  const choosePreset = (next: PlaygroundPreset) => {
    setPreset(next);
    setCode(next.code);
    setError(null);
    setStatus('idle');
    resetStage();
  };

  const togglePause = () => {
    if (controlsRef.current.length === 0) {
      return;
    }

    const next = !paused;

    for (const animation of controlsRef.current) {
      if (next) {
        animation.pause();
      } else {
        animation.play();
      }
    }

    setPaused(next);
    setStatus(next ? 'paused' : 'running');
  };

  const changeSpeed = (value: number) => {
    speedRef.current = value;
    setPlaybackSpeed(controlsRef.current, value);
    setSpeed(value);
  };

  const copyCode = () => {
    void globalThis.navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        globalThis.clearTimeout(copiedTimer.current);
        copiedTimer.current = globalThis.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => setCopied(false));
  };

  const handleCodeKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
      return;
    }

    // Keyboard escape hatch: Escape releases the Tab trap for one press, so a
    // reader who only uses the keyboard can leave the editor (WCAG 2.1.2).
    if (event.key === 'Escape') {
      tabReleaseRef.current = true;
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    if (tabReleaseRef.current) {
      tabReleaseRef.current = false;
      return;
    }

    event.preventDefault();
    const target = event.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    setCode(`${code.slice(0, start)}  ${code.slice(end)}`);
    globalThis.requestAnimationFrame(() => {
      target.selectionStart = start + 2;
      target.selectionEnd = start + 2;
    });
  };

  const edited = code !== preset.code;

  return (
    <article className="demo-page playground-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#/">demo</a>
          </li>
          <li aria-current="page">playground</li>
        </ol>
        <span className="crumbs__count">sửa code · xem ngay</span>
      </nav>

      <h1>Playground</h1>
      <p className="lead">
        Sửa snippet, chạy lại và xem thay đổi ngay trên stage. Đây là nơi học bằng tay: code chạy
        đúng như bạn gõ, không phải video.
      </p>

      <div className="playground__presets" role="group" aria-label="Preset playground">
        {PLAYGROUND_PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="filter"
            aria-pressed={item.id === preset.id}
            onClick={() => choosePreset(item)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="playground__preset-note">
        <strong>{preset.label}</strong> — {preset.note}
        {edited ? ' · đã sửa' : ''}
      </p>

      <div className="playground__grid">
        <section className="stage playground__stage-frame" aria-label="Stage playground">
          <div className="stage__bar mono">
            <span>stage · playground</span>
            <span className="playground__status" role="status">
              {STATUS_LABEL[status]}
            </span>
          </div>

          <div className="playground__stage-body" ref={stageRef}>
            <div className="playground__lane" ref={laneRef}>
              <span className="playground__goal" ref={goalRef} aria-hidden="true" />
              <span
                key={`box-${stageKey}`}
                className="playground__box"
                ref={boxRef}
                aria-hidden="true"
              />
            </div>

            <div className="playground__dots" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span key={`dot-${stageKey}-${dot}`} className="playground__dot" />
              ))}
            </div>
          </div>

          <div className="playground__controls">
            <button type="button" className="demo-button" onClick={runCode}>
              Chạy lại
            </button>
            <button
              type="button"
              className="demo-button"
              aria-pressed={paused}
              disabled={status === 'idle' || status === 'done' || status === 'error'}
              onClick={togglePause}
            >
              {paused ? 'Tiếp tục' : 'Tạm dừng'}
            </button>

            <span className="playground__speed-label mono">tốc độ</span>
            {SPEEDS.map((value) => (
              <button
                key={value}
                type="button"
                className="filter"
                aria-pressed={speed === value}
                onClick={() => changeSpeed(value)}
              >
                {value}×
              </button>
            ))}
          </div>
        </section>

        <section className="playground__panel" aria-labelledby="playground-code">
          <div className="playground__panel-head">
            <h2 id="playground-code">snippet · motion</h2>
            <button type="button" className="playground__copy" onClick={copyCode}>
              {copied ? 'đã chép' : 'chép'}
            </button>
            <p className="visually-hidden" role="status" aria-live="polite">
              {copied ? 'Đã chép snippet.' : ''}
            </p>
          </div>

          <textarea
            id="playground-editor"
            className="playground__code"
            aria-label="Snippet animation"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleCodeKeyDown}
            onBlur={() => {
              tabReleaseRef.current = false;
            }}
          />

          {error ? (
            <p className="playground__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="playground__actions">
            <button type="button" className="demo-button playground__run" onClick={runCode}>
              Chạy (Ctrl/⌘ + Enter)
            </button>
            <button type="button" className="demo-button" onClick={() => choosePreset(preset)}>
              Khôi phục preset
            </button>
          </div>

          <p className="playground__hint">
            Có sẵn: <code>box</code> (phần tử chính), <code>dots</code> (5 ô), <code>distance</code>{' '}
            (quãng đường), <code>animate</code>, <code>stagger</code>. <code>Tab</code> chèn 2
            space; <code>Esc</code> rồi <code>Tab</code> để thoát editor.
          </p>
          <p className="playground__hint">
            {systemReduce
              ? 'Hệ thống đang bật giảm chuyển động: playground chỉ chạy khi bạn bấm Chạy.'
              : 'Code tự chạy sau 0.6s ngừng gõ. Snippet chỉ chạy trong tab này, không được gửi đi hay lưu vào URL.'}
          </p>

          <details className="playground__react">
            <summary>Bản React của preset (chỉ đọc)</summary>
            <pre className="playground__react-code">
              <code>{preset.reactCode}</code>
            </pre>
            <p className="playground__hint">
              Demo page chạy đúng bản React này. Playground chỉ thực thi snippet vanilla ở trên —
              chạy JSX live cần một compiler trong trình duyệt, nên lab giữ bản vanilla để nhẹ.
            </p>
          </details>
        </section>
      </div>
    </article>
  );
}
