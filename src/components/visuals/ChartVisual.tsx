type ChartVisualProps = {
  categories: string[];
  counts: number[];
};

/** Kid-readable fills keyed by color words found in the category label. */
const NAMED_COLORS: Record<string, string> = {
  red: "#d64545",
  blue: "#3f73b7",
  green: "#2d7e73",
  yellow: "#d8a93b",
  orange: "#ee7a2e",
  pink: "#c73b7a",
  purple: "#7a5ea8",
  brown: "#a06a3c",
  black: "#2a2a2a",
  white: "#f4efe0",
  gray: "#8a8a8a",
  grey: "#8a8a8a",
};

/** Distinct palette for non-color categories (pets, weekdays, etc.). */
const FALLBACK_PALETTE = ["#d64545", "#3f73b7", "#2d7e73", "#ee7a2e", "#d8a93b", "#c73b7a", "#7a5ea8"];

export function barColorForCategory(category: string, index: number): string {
  const lower = category.toLowerCase();
  for (const [name, color] of Object.entries(NAMED_COLORS)) {
    if (lower.includes(name)) return color;
  }
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}

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
          const fill = barColorForCategory(cat, i);
          return (
            <g key={`${cat}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                className="chart-bar"
                style={{ fill }}
              />
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
