/**
 * Analytic spring curve for the playground. The snippet is the source of truth:
 * the graph reads the same stiffness/damping/mass numbers that Motion receives,
 * so editing the code redraws the plot without a second set of controls.
 */

const WIDTH = 320;
const HEIGHT = 120;
const PLOT_LEFT = 30;
const PLOT_RIGHT = 310;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 96;
const SAMPLES = 96;
const STEP = 1 / 240;
const MAX_HORIZON = 3;
const SETTLE_THRESHOLD = 0.01;

/** Motion's spring defaults, used only when the snippet omits a value. */
const DEFAULT_STIFFNESS = 100;
const DEFAULT_DAMPING = 10;
const DEFAULT_MASS = 1;

export type SpringKind = 'underdamped' | 'critical' | 'overdamped';

export type SpringCurve = {
  /** SVG path in the 320×120 viewBox. */
  path: string;
  width: number;
  height: number;
  baselineY: number;
  targetY: number;
  /** Plotted time span in seconds. */
  duration: number;
  stiffness: number;
  damping: number;
  mass: number;
  zeta: number;
  kind: SpringKind;
  /** Percentage above the target, 0 when the spring does not overshoot. */
  overshoot: number;
  /** Seconds until the curve stays within 1% of the target. */
  settle: number;
};

const numberAfter = (code: string, key: string): number | null => {
  const match = new RegExp(`\\b${key}\\s*:\\s*(-?(?:\\d+(?:\\.\\d+)?|\\.\\d+))`).exec(code);

  return match ? Number(match[1]) : null;
};

const positionAt = (time: number, stiffness: number, damping: number, mass: number): number => {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  if (zeta < 0.999) {
    const damped = omega * Math.sqrt(1 - zeta * zeta);

    return (
      1 -
      Math.exp(-zeta * omega * time) *
        (Math.cos(damped * time) + ((zeta * omega) / damped) * Math.sin(damped * time))
    );
  }

  if (zeta <= 1.001) {
    return 1 - Math.exp(-omega * time) * (1 + omega * time);
  }

  const root = Math.sqrt(zeta * zeta - 1);
  const first = -omega * (zeta - root);
  const second = -omega * (zeta + root);
  const firstWeight = second / (second - first);
  const secondWeight = -first / (second - first);

  return 1 - firstWeight * Math.exp(first * time) - secondWeight * Math.exp(second * time);
};

const kindOf = (zeta: number): SpringKind => {
  if (zeta < 0.999) {
    return 'underdamped';
  }

  return zeta > 1.001 ? 'overdamped' : 'critical';
};

export const springCurveFromCode = (code: string): SpringCurve | null => {
  if (!/type\s*:\s*['"]spring['"]/.test(code)) {
    return null;
  }

  const stiffness = numberAfter(code, 'stiffness') ?? DEFAULT_STIFFNESS;
  const damping = numberAfter(code, 'damping') ?? DEFAULT_DAMPING;
  const mass = numberAfter(code, 'mass') ?? DEFAULT_MASS;

  if (
    !Number.isFinite(stiffness) ||
    !Number.isFinite(damping) ||
    !Number.isFinite(mass) ||
    stiffness <= 0 ||
    damping < 0 ||
    mass <= 0
  ) {
    return null;
  }

  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  let settle = 0;
  let peak = 1;

  for (let time = 0; time <= MAX_HORIZON; time += STEP) {
    const position = positionAt(time, stiffness, damping, mass);

    peak = Math.max(peak, position);

    if (Math.abs(position - 1) > SETTLE_THRESHOLD) {
      settle = time;
    }
  }

  const settleTime = Math.min(MAX_HORIZON, Math.max(0.05, settle + STEP));
  const duration = Math.min(MAX_HORIZON, Math.max(0.6, settleTime * 1.08));
  const top = Math.max(1.05, peak + 0.05);
  const bottom = -0.05;

  const xOf = (time: number) => PLOT_LEFT + (time / duration) * (PLOT_RIGHT - PLOT_LEFT);
  const yOf = (value: number) =>
    PLOT_TOP + ((top - value) / (top - bottom)) * (PLOT_BOTTOM - PLOT_TOP);

  const points: string[] = [];

  for (let index = 0; index <= SAMPLES; index += 1) {
    const time = (index / SAMPLES) * duration;
    const position = positionAt(time, stiffness, damping, mass);

    points.push(`${index === 0 ? 'M' : 'L'}${xOf(time).toFixed(1)} ${yOf(position).toFixed(1)}`);
  }

  return {
    path: points.join(' '),
    width: WIDTH,
    height: HEIGHT,
    baselineY: yOf(0),
    targetY: yOf(1),
    duration,
    stiffness,
    damping,
    mass,
    zeta,
    kind: kindOf(zeta),
    overshoot: Math.max(0, Math.round((peak - 1) * 100)),
    settle: settleTime,
  };
};
