import { describe, expect, it } from "vitest";
import {
  clampPatrolX,
  oppositeFacing,
  patrolLaneWidth,
  patrolTargetX,
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
});
