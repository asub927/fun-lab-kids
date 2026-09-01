type ChartVisualProps = {
  categories: string[];
  counts: number[];
};

export function ChartVisual({ categories, counts }: ChartVisualProps) {
  const max = Math.max(1, ...counts);
  const barWidth = Math.min(48, 220 / Math.max(categories.length, 1));
  const gap = 16;
  const chartWidth = categories.length * (barWidth + gap) + gap;
  const chartHeight = 160;
  const baseline = 130;

  return (
    <figure className="visual-board chart-visual" aria-label="Bar chart">
      <svg
        viewBox={`0 0 ${Math.max(chartWidth, 200)} ${chartHeight}`}
        role="img"
        className="chart-svg"
      >
        <title>Bar chart of category counts</title>
        <line
          x1="8"
          y1={baseline}
          x2={chartWidth - 8}
          y2={baseline}
          className="chart-axis"
        />
        {categories.map((cat, i) => {
          const value = counts[i] ?? 0;
          const h = (value / max) * 90;
          const x = gap + i * (barWidth + gap);
          const y = baseline - h;
          return (
            <g key={cat}>
              <rect x={x} y={y} width={barWidth} height={h} className="chart-bar" />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                className="chart-count"
                textAnchor="middle"
              >
                {value}
              </text>
              <text
                x={x + barWidth / 2}
                y={baseline + 18}
                className="chart-label"
                textAnchor="middle"
              >
                {cat}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
