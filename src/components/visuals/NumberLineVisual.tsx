type NumberLineVisualProps = {
  min?: number;
  max?: number;
  start: number;
  end?: number;
};

export function NumberLineVisual({ min = 0, max = 20, start, end }: NumberLineVisualProps) {
  const span = Math.max(max - min, 1);
  const ticks = Array.from({ length: span + 1 }, (_, index) => min + index);

  return (
    <figure className="visual-board number-line-visual" aria-label="Number line">
      <div className="number-line-track">
        {ticks.map((tick) => (
          <span
            key={tick}
            className={`number-line-tick ${tick === start || tick === end ? "marked" : ""}`}
          >
            {tick % 5 === 0 || tick === start || tick === end ? tick : ""}
          </span>
        ))}
        <span
          className="number-line-marker start"
          style={{ left: `${((start - min) / span) * 100}%` }}
        />
        {end !== undefined && (
          <span
            className="number-line-marker end"
            style={{ left: `${((end - min) / span) * 100}%` }}
          />
        )}
      </div>
    </figure>
  );
}
