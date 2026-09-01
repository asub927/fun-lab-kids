type ChartVisualProps = {
  categories: string[];
  counts: number[];
};

/** Saturated kid-readable fills for color words in category labels. */
const NAMED_COLORS: Record<string, string> = {
  red: "#e53935",
  blue: "#1e88e5",
  green: "#43a047",
  yellow: "#fdd835",
  orange: "#fb8c00",
  pink: "#d81b60",
  purple: "#8e24aa",
  brown: "#6d4c41",
  black: "#212121",
  white: "#fafafa",
  gray: "#757575",
  grey: "#757575",
};

/** Distinct palette for non-color categories (pets, weekdays, etc.). */
const FALLBACK_PALETTE = ["#e53935", "#1e88e5", "#43a047", "#fb8c00", "#fdd835", "#d81b60", "#8e24aa"];

export function barColorForCategory(category: string, index: number): string {
  const lower = category.toLowerCase();
  for (const [name, color] of Object.entries(NAMED_COLORS)) {
    if (lower.includes(name)) return color;
  }
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}

export function barColorToken(category: string, index: number): string {
  const lower = category.toLowerCase();
  for (const name of Object.keys(NAMED_COLORS)) {
    if (lower.includes(name)) return name;
  }
  return `tone-${index % FALLBACK_PALETTE.length}`;
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
          const token = barColorToken(cat, i);
          return (
            <g key={`${cat}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                className={`chart-bar chart-bar--${token}`}
                fill={fill}
                data-category={cat}
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
