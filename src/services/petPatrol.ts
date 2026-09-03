import type { PetMood } from "../data/pets";

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

/** Quieter lab contract uses route presence, not sticky lab session state. */
export function isLabRoute(pathname: string): boolean {
  return pathname.startsWith("/lab/");
}

/**
 * Patrol (L→R roam) only when calm, motion is allowed, and the kid is off a lab route.
 */
export function shouldAllowPetPatrol(options: {
  mood: PetMood;
  onLabRoute: boolean;
  enabled: boolean;
}): boolean {
  return options.enabled && options.mood === "idle" && !options.onLabRoute;
}

/** When patrol stops, keep X in-lane instead of snapping to the left edge. */
export function parkPatrolX(currentX: number, bounds: PatrolBounds): number {
  return clampPatrolX(currentX, bounds);
}

/** First-load rest corner — right edge so greeting speech has room to the left. */
export function restPatrolX(bounds: PatrolBounds): number {
  return bounds.maxX;
}

/** True once the footer lane has a measurable width to park against. */
export function hasPatrolLane(bounds: PatrolBounds): boolean {
  return bounds.maxX > bounds.minX;
}

export function patrolLaneWidth(containerWidth: number, petSize: number): PatrolBounds {
  const lanePadding = 8;
  const minX = lanePadding;
  const maxX = Math.max(minX, containerWidth - petSize - lanePadding);
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
