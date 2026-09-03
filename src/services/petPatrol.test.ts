import { describe, expect, it } from "vitest";
import {
  clampPatrolX,
  isLabRoute,
  oppositeFacing,
  parkPatrolX,
  patrolLaneWidth,
  patrolTargetX,
  shouldAllowPetPatrol,
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

  it("detects lab routes by pathname prefix (AE1/AE5/AE7)", () => {
    expect(isLabRoute("/lab/NC.2.NBT.1")).toBe(true);
    expect(isLabRoute("/lab/")).toBe(true);
    expect(isLabRoute("/")).toBe(false);
    expect(isLabRoute("/grade-2")).toBe(false);
    expect(isLabRoute("/progress")).toBe(false);
  });

  it("allows patrol only when idle, enabled, and off lab (AE1/AE5)", () => {
    expect(
      shouldAllowPetPatrol({ mood: "idle", onLabRoute: true, enabled: true }),
    ).toBe(false);
    expect(
      shouldAllowPetPatrol({ mood: "idle", onLabRoute: false, enabled: true }),
    ).toBe(true);
    expect(
      shouldAllowPetPatrol({ mood: "waiting", onLabRoute: false, enabled: true }),
    ).toBe(false);
    expect(
      shouldAllowPetPatrol({ mood: "idle", onLabRoute: false, enabled: false }),
    ).toBe(false);
  });

  it("parks in place instead of snapping to minX", () => {
    const bounds = { minX: 8, maxX: 300 };
    expect(parkPatrolX(180, bounds)).toBe(180);
    expect(parkPatrolX(2, bounds)).toBe(8);
    expect(parkPatrolX(400, bounds)).toBe(300);
  });
});
