type RulerProps = {
  length: number;
  unit: string;
  max?: number;
};

export function RulerVisual({ length, unit, max = 12 }: RulerProps) {
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <div className="lab-visual ruler-visual" aria-hidden="true">
      <div className="ruler-bar">
        {ticks.map((tick) => (
          <span key={tick} className={`ruler-tick ${tick % 5 === 0 ? "major" : ""}`}>
            {tick % 5 === 0 ? tick : ""}
          </span>
        ))}
        <span className="ruler-fill" style={{ width: `${Math.min(100, (length / max) * 100)}%` }} />
      </div>
      <p className="lab-visual-caption">
        The bar shows about {length} {unit}.
      </p>
    </div>
  );
}

type BarChartProps = {
  categories: string[];
  counts: number[];
};

export function BarChartVisual({ categories, counts }: BarChartProps) {
  const max = Math.max(...counts, 1);
  return (
    <div className="lab-visual bar-chart-visual" role="img" aria-label="Bar chart">
      <div className="bar-chart-grid">
        {categories.map((label, index) => (
          <div key={label} className="bar-chart-column">
            <span className="bar-chart-value">{counts[index]}</span>
            <span
              className="bar-chart-bar"
              style={{ height: `${(counts[index] / max) * 100}%` }}
            />
            <span className="bar-chart-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type ShapeVisualProps = {
  shape: string;
  parts?: number;
};

export function ShapeVisual({ shape, parts }: ShapeVisualProps) {
  return (
    <div className="lab-visual shape-visual" aria-hidden="true">
      <div className={`shape-icon shape-icon--${shape}${parts ? " shape-icon--partitioned" : ""}`}>
        {parts ? (
          <span className="shape-parts">{parts} equal parts</span>
        ) : (
          <span className="shape-name">{shape}</span>
        )}
      </div>
    </div>
  );
}

type NumberLineProps = {
  min?: number;
  max?: number;
  start: number;
  end?: number;
};

export function NumberLineVisual({ min = 0, max = 20, start, end }: NumberLineProps) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="lab-visual number-line-visual" aria-hidden="true">
      <div className="number-line-track">
        {ticks.map((tick) => (
          <span key={tick} className={`number-line-tick ${tick === start || tick === end ? "marked" : ""}`}>
            {tick % 5 === 0 || tick === start || tick === end ? tick : ""}
          </span>
        ))}
        <span className="number-line-marker start" style={{ left: `${((start - min) / (max - min)) * 100}%` }} />
        {end !== undefined && (
          <span className="number-line-marker end" style={{ left: `${((end - min) / (max - min)) * 100}%` }} />
        )}
      </div>
    </div>
  );
}

type ClockVisualProps = {
  time: string;
};

export function ClockVisual({ time }: ClockVisualProps) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  return (
    <div className="lab-visual clock-visual" aria-hidden="true">
      <div className="clock-face">
        <span
          className="clock-hand hour"
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />
        <span
          className="clock-hand minute"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />
      </div>
      <p className="lab-visual-caption">Read the clock hands.</p>
    </div>
  );
}

type CoinVisualProps = {
  coins: string;
};

export function CoinVisual({ coins }: CoinVisualProps) {
  const parts = coins.split(",").map((part) => part.trim()).filter(Boolean);
  return (
    <div className="lab-visual coin-visual" aria-hidden="true">
      <div className="coin-row">
        {parts.map((part) => (
          <span key={part} className="coin-chip">
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}
