import { useMemo } from 'react';
import { springCurveFromCode } from './springCurve';

type Props = {
  /** The editable snippet; the graph reads its spring parameters. */
  code: string;
};

export default function SpringCurve({ code }: Props) {
  const curve = useMemo(() => springCurveFromCode(code), [code]);

  if (!curve) {
    return null;
  }

  const label = `Đường cong spring ${curve.kind}: stiffness ${curve.stiffness}, damping ${curve.damping}, zeta ${curve.zeta.toFixed(2)}, overshoot ${curve.overshoot}%, settle ${curve.settle.toFixed(2)} giây.`;

  return (
    <figure className="spring-curve">
      <figcaption className="spring-curve__head">
        <span>
          spring · k {curve.stiffness} · c {curve.damping}
          {curve.mass !== 1 ? ` · m ${curve.mass}` : ''}
        </span>
        <span className="spring-curve__kind">{curve.kind}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${curve.width} ${curve.height}`}
        role="img"
        aria-label={label}
        className="spring-curve__plot"
      >
        <line
          className="spring-curve__baseline"
          x1={30}
          y1={curve.baselineY}
          x2={310}
          y2={curve.baselineY}
        />
        <line
          className="spring-curve__target"
          x1={30}
          y1={curve.targetY}
          x2={310}
          y2={curve.targetY}
        />
        <path className="spring-curve__path" d={curve.path} />

        <text className="spring-curve__tick" x={26} y={curve.targetY + 3} textAnchor="end">
          1
        </text>
        <text className="spring-curve__tick" x={26} y={curve.baselineY + 3} textAnchor="end">
          0
        </text>
        <text className="spring-curve__tick" x={30} y={110}>
          0
        </text>
        <text className="spring-curve__tick" x={310} y={110} textAnchor="end">
          {curve.duration.toFixed(1)}s
        </text>
      </svg>

      <p className="spring-curve__stats">
        ζ {curve.zeta.toFixed(2)} · overshoot {curve.overshoot}% · settle {curve.settle.toFixed(2)}s
      </p>
    </figure>
  );
}
