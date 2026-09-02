export type PatrolBounds = {
  minX: number;
  maxX: number;
};

export type PatrolTiming = {
  walkMs: number;
  pauseMs: number;
};

export const PATROL_IDLE_TIMING: PatrolTiming = {
  walkMs: 5200,
  pauseMs: 2200,
};

export function patrolLaneWidth(viewportWidth: number, petSize: number): PatrolBounds {
  const safeLeft = 12;
  const safeRight = 12;
  const lanePadding = Math.min(48, viewportWidth * 0.08);
  const minX = safeLeft + lanePadding;
  const maxX = Math.max(minX, viewportWidth - petSize - safeRight - lanePadding);
  return { minX, maxX };
}

export function petSizeForViewport(width: number): number {
  return width <= 640 ? 58 : 68;
}

export function clampPatrolX(x: number, bounds: PatrolBounds): number {
  return Math.min(bounds.maxX, Math.max(bounds.minX, x));
}

export function oppositeFacing(facing: "left" | "right"): "left" | "right" {
  return facing === "left" ? "right" : "left";
}

export function patrolTargetX(
  facing: "left" | "right",
  bounds: PatrolBounds,
): number {
  return facing === "right" ? bounds.maxX : bounds.minX;
}
