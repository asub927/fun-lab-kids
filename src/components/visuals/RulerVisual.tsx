type RulerVisualProps = {
  length: number;
  unit: string;
  object: string;
};

export function RulerVisual({ length, unit, object }: RulerVisualProps) {
  const max = Math.max(length + 1, unit.includes("meter") ? 3 : 12);
  const tickCount = max;
  const width = 280;
  const pad = 20;
  const usable = width - pad * 2;
  const objectWidth = (length / max) * usable;

  return (
    <figure className="visual-board ruler-visual" aria-label={`Measuring ${object}`}>
      <p className="visual-caption">{object}</p>
      <svg viewBox={`0 0 ${width} 110`} role="img" className="ruler-svg">
        <title>
          A {object} lined up on a {unit} ruler
        </title>
        {/* object bar */}
        <rect x={pad} y="18" width={objectWidth} height="28" className="ruler-object" rx="6" />
        {/* ruler body */}
        <rect x={pad} y="58" width={usable} height="32" className="ruler-body" rx="4" />
        {Array.from({ length: tickCount + 1 }, (_, i) => {
          const x = pad + (i / max) * usable;
          const major = i % 1 === 0;
          return (
            <g key={i}>
              <line
                x1={x}
                y1="58"
                x2={x}
                y2={major ? 78 : 70}
                className="ruler-tick"
              />
              <text x={x} y="98" className="ruler-num" textAnchor="middle">
                {i}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="visual-caption muted">Units: {unit}</p>
    </figure>
  );
}
