/** Shared geometry helpers for SVG shape visuals. */

export type ShapeName =
  | "triangle"
  | "square"
  | "rectangle"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "nonagon"
  | "decagon"
  | "trapezoid"
  | "circle"
  | "rhombus"
  | "quadrilateral";

export function regularPolygonPoints(
  sides: number,
  cx = 100,
  cy = 100,
  radius = 72,
  rotation = -Math.PI / 2,
): string {
  return Array.from({ length: sides }, (_, i) => {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export function shapePolygonPoints(shape: string): string | null {
  switch (shape) {
    case "triangle":
      return regularPolygonPoints(3);
    case "square":
      return regularPolygonPoints(4, 100, 100, 68, Math.PI / 4);
    case "rectangle":
      return "40,55 160,55 160,145 40,145";
    case "rhombus":
    case "quadrilateral":
      return "100,28 168,100 100,172 32,100";
    case "trapezoid":
      return "50,55 150,55 175,145 25,145";
    case "pentagon":
      return regularPolygonPoints(5);
    case "hexagon":
      return regularPolygonPoints(6, 100, 100, 72, 0);
    case "heptagon":
      return regularPolygonPoints(7);
    case "octagon":
      return regularPolygonPoints(8, 100, 100, 72, Math.PI / 8);
    case "nonagon":
      return regularPolygonPoints(9);
    case "decagon":
      return regularPolygonPoints(10, 100, 100, 72, Math.PI / 10);
    default:
      return null;
  }
}

/** Partition lines through the center for equal-share questions. */
export function partitionLines(
  shape: string,
  parts: number,
): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const cx = 100;
  const cy = 100;
  if (parts < 2) return [];

  if (shape === "circle" || shape === "hexagon" || shape === "octagon") {
    return Array.from({ length: parts }, (_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / parts;
      return {
        x1: cx,
        y1: cy,
        x2: cx + 72 * Math.cos(angle),
        y2: cy + 72 * Math.sin(angle),
      };
    });
  }

  // Rectangles / squares / trapezoids: vertical (and horizontal for 4) cuts
  if (shape === "rectangle" || shape === "square" || shape === "trapezoid") {
    const left = shape === "trapezoid" ? 38 : 40;
    const right = shape === "trapezoid" ? 162 : 160;
    const top = 55;
    const bottom = 145;
    if (parts === 2) {
      return [{ x1: (left + right) / 2, y1: top, x2: (left + right) / 2, y2: bottom }];
    }
    if (parts === 3) {
      const w = right - left;
      return [
        { x1: left + w / 3, y1: top, x2: left + w / 3, y2: bottom },
        { x1: left + (2 * w) / 3, y1: top, x2: left + (2 * w) / 3, y2: bottom },
      ];
    }
    // fourths
    return [
      { x1: (left + right) / 2, y1: top, x2: (left + right) / 2, y2: bottom },
      { x1: left, y1: (top + bottom) / 2, x2: right, y2: (top + bottom) / 2 },
    ];
  }

  // Default radial slices for polygons / triangles
  return Array.from({ length: parts }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / parts;
    return {
      x1: cx,
      y1: cy,
      x2: cx + 70 * Math.cos(angle),
      y2: cy + 70 * Math.sin(angle),
    };
  });
}
