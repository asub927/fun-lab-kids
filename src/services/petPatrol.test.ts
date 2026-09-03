import { describe, expect, it } from "vitest";
import {
  clampPatrolX,
  defaultExclusionRects,
  facingForDeltaX,
  oppositeFacing,
  patrolLaneWidth,
  patrolTargetX,
  pickWanderPoint,
  pointClearOfExclusions,
  wanderBoundsForViewport,
} from "./petPatrol";

describe("petPatrol", () => {
  it("computes a horizontal patrol lane inside a container", () => {
    const bounds = patrolLaneWidth(400, 68);
    expect(bounds.minX).toBe(8);
    expect(bounds.maxX).toBe(324);
    expect(bounds.maxX).toBeGreaterThan(bounds.minX);
  });

  it("targets lane edges by facing", () => {
    const bounds = { minX: 20, maxX: 300 };
    expect(patrolTargetX("right", bounds)).toBe(300);
    expect(patrolTargetX("left", bounds)).toBe(20);
  });

  it("clamps patrol position", () => {
    const bounds = { minX: 20, maxX: 300 };
    expect(clampPatrolX(10, bounds)).toBe(20);
    expect(clampPatrolX(400, bounds)).toBe(300);
  });

  it("flips facing", () => {
    expect(oppositeFacing("left")).toBe("right");
    expect(oppositeFacing("right")).toBe("left");
  });

  it("builds a 2D wander box inside the viewport", () => {
    const bounds = wanderBoundsForViewport(1280, 800, 72);
    expect(bounds.minX).toBeGreaterThan(0);
    expect(bounds.minY).toBeGreaterThan(0);
    expect(bounds.maxX).toBeLessThan(1280);
    expect(bounds.maxY).toBeLessThan(800);
    expect(bounds.maxX).toBeGreaterThan(bounds.minX);
    expect(bounds.maxY).toBeGreaterThan(bounds.minY);
  });

  it("picks wander points clear of exclusion pads", () => {
    const bounds = wanderBoundsForViewport(1000, 700, 64);
    const exclusions = defaultExclusionRects(1000, 700);
    const point = pickWanderPoint(bounds, 64, exclusions, () => 0.5);
    expect(pointClearOfExclusions(point, 64, exclusions)).toBe(true);
    expect(point.x).toBeGreaterThanOrEqual(bounds.minX);
    expect(point.y).toBeGreaterThanOrEqual(bounds.minY);
  });

  it("faces left or right from delta X", () => {
    expect(facingForDeltaX(-12, "right")).toBe("left");
    expect(facingForDeltaX(12, "left")).toBe("right");
    expect(facingForDeltaX(0, "left")).toBe("left");
  });
});
