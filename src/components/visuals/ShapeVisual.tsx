import { partitionLines, shapePolygonPoints } from "./shapeGeometry";

type ShapeVisualProps = {
  shape: string;
  /** When set, draw equal-share partition lines on the shape. */
  parts?: number;
  label?: string;
};

export function ShapeVisual({ shape, parts, label }: ShapeVisualProps) {
  const points = shapePolygonPoints(shape);
  const isCircle = shape === "circle";
  const lines = typeof parts === "number" && parts >= 2 ? partitionLines(shape, parts) : [];

  return (
    <figure className="visual-board shape-visual" aria-label={label ?? "Mystery shape"}>
      <svg viewBox="0 0 200 200" role="img" aria-hidden={label ? undefined : true}>
        <title>{label ?? "Shape to identify"}</title>
        {isCircle ? (
          <circle cx="100" cy="100" r="72" className="shape-fill" />
        ) : points ? (
          <polygon points={points} className="shape-fill" />
        ) : (
          <rect x="40" y="40" width="120" height="120" className="shape-fill" />
        )}
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="shape-partition"
          />
        ))}
      </svg>
    </figure>
  );
}
