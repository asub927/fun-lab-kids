export type PatrolBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type PatrolTiming = {
  walkMs: number;
  pauseMs: number;
};

export type ExclusionRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Point = { x: number; y: number };

/** Idle roam across the viewport. */
export const PATROL_IDLE_TIMING: PatrolTiming = {
  walkMs: 6200,
  pauseMs: 2400,
};

/** Shorter hops while working / waiting. */
export const PATROL_WORKING_TIMING: PatrolTiming = {
  walkMs: 3800,
  pauseMs: 1600,
};

/** @deprecated Prefer viewport wander bounds. Kept for older horizontal helpers. */
export function patrolLaneWidth(containerWidth: number, petSize: number): { minX: number; maxX: number } {
  const lanePadding = 8;
  const minX = lanePadding;
  const maxX = Math.max(minX, containerWidth - petSize - lanePadding);
  return { minX, maxX };
}

export function petSizeForViewport(width: number): number {
  return width <= 640 ? 58 : 72;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampPoint(point: Point, bounds: PatrolBounds): Point {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    y: clamp(point.y, bounds.minY, bounds.maxY),
  };
}

/** Safe wander box: pad top nav, sides, and bottom chrome. */
export function wanderBoundsForViewport(
  viewportWidth: number,
  viewportHeight: number,
  petSize: number,
): PatrolBounds {
  const padX = viewportWidth <= 640 ? 12 : 20;
  const padTop = viewportWidth <= 640 ? 72 : 88;
  const padBottom = viewportWidth <= 640 ? 96 : 112;
  const minX = padX;
  const maxX = Math.max(minX, viewportWidth - petSize - padX);
  const minY = padTop;
  const maxY = Math.max(minY, viewportHeight - petSize - padBottom);
  return { minX, maxX, minY, maxY };
}

export function defaultExclusionRects(
  viewportWidth: number,
  viewportHeight: number,
): ExclusionRect[] {
  const navBottom = viewportWidth <= 640 ? 64 : 72;
  const actionBandTop = Math.max(0, viewportHeight - (viewportWidth <= 640 ? 168 : 148));
  return [
    { left: 0, top: 0, right: viewportWidth, bottom: navBottom },
    {
      left: Math.max(0, viewportWidth - 220),
      top: Math.max(0, viewportHeight - 240),
      right: viewportWidth,
      bottom: viewportHeight,
    },
    { left: 0, top: actionBandTop, right: viewportWidth, bottom: viewportHeight },
  ];
}

export function rectsOverlap(
  ax: number,
  ay: number,
  size: number,
  rect: ExclusionRect,
  margin = 8,
): boolean {
  const left = ax - margin;
  const top = ay - margin;
  const right = ax + size + margin;
  const bottom = ay + size + margin;
  return !(right <= rect.left || left >= rect.right || bottom <= rect.top || top >= rect.bottom);
}

export function pointClearOfExclusions(
  point: Point,
  petSize: number,
  exclusions: ExclusionRect[],
): boolean {
  return exclusions.every((rect) => !rectsOverlap(point.x, point.y, petSize, rect));
}

export function pickWanderPoint(
  bounds: PatrolBounds,
  petSize: number,
  exclusions: ExclusionRect[],
  random: () => number = Math.random,
): Point {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidate = {
      x: bounds.minX + random() * Math.max(0, bounds.maxX - bounds.minX),
      y: bounds.minY + random() * Math.max(0, bounds.maxY - bounds.minY),
    };
    const clamped = clampPoint(candidate, bounds);
    if (pointClearOfExclusions(clamped, petSize, exclusions)) return clamped;
  }
  return clampPoint({ x: bounds.minX, y: bounds.minY }, bounds);
}

export function facingForDeltaX(deltaX: number, previous: "left" | "right"): "left" | "right" {
  if (Math.abs(deltaX) < 2) return previous;
  return deltaX < 0 ? "left" : "right";
}

export function oppositeFacing(facing: "left" | "right"): "left" | "right" {
  return facing === "left" ? "right" : "left";
}

/** Legacy 1D helpers used by older tests / call sites. */
export function clampPatrolX(x: number, bounds: { minX: number; maxX: number }): number {
  return clamp(x, bounds.minX, bounds.maxX);
}

export function patrolTargetX(
  facing: "left" | "right",
  bounds: { minX: number; maxX: number },
): number {
  return facing === "right" ? bounds.maxX : bounds.minX;
}
