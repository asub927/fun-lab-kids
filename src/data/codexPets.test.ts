import { describe, expect, it } from "vitest";
import {
  CODEX_ANIMATIONS,
  codexFramePosition,
  getCodexPetPackage,
  moodToCodexAction,
  resolveCodexAction,
} from "./codexPets";

describe("codexPets", () => {
  it("loads the om-nom package", () => {
    const pkg = getCodexPetPackage("om-nom--kasyan1337");
    expect(pkg?.displayName).toBe("Om Nom");
    expect(pkg?.spriteVersionNumber).toBe(2);
    expect(pkg?.spritesheetPath).toContain("spritesheet.webp");
  });

  it("loads the jinmao package", () => {
    const pkg = getCodexPetPackage("jinmao--legeling");
    expect(pkg?.displayName).toBe("Buddy");
    expect(pkg?.spriteVersionNumber).toBe(2);
    expect(pkg?.spritesheetPath).toContain("jinmao--legeling");
  });

  it("loads the chispa package", () => {
    const pkg = getCodexPetPackage("chispa--giiilberto-nm");
    expect(pkg?.displayName).toBe("Chispa");
    expect(pkg?.spriteVersionNumber).toBe(1);
    expect(pkg?.spritesheetPath).toContain("chispa--giiilberto-nm");
  });

  it("loads the serge-le-lapin package", () => {
    const pkg = getCodexPetPackage("serge-le-lapin--legeling");
    expect(pkg?.displayName).toBe("Hopper");
    expect(pkg?.spriteVersionNumber).toBe(2);
    expect(pkg?.spritesheetPath).toContain("serge-le-lapin--legeling");
  });

  it("maps moods to Codex animation rows", () => {
    expect(moodToCodexAction("idle", "right")).toBe("idle");
    expect(moodToCodexAction("working", "right")).toBe("failed");
    expect(moodToCodexAction("celebrating", "right")).toBe("jumping");
    expect(moodToCodexAction("waiting", "right")).toBe("waiting");
    expect(moodToCodexAction("waving", "right")).toBe("waving");
  });

  it("uses running sprites while patrolling during idle", () => {
    expect(resolveCodexAction({ mood: "idle", facing: "right", patrolling: true })).toBe(
      "running-right",
    );
    expect(resolveCodexAction({ mood: "idle", facing: "left", patrolling: true })).toBe(
      "running-left",
    );
    expect(resolveCodexAction({ mood: "idle", facing: "right", patrolling: false })).toBe("idle");
  });

  it("computes background positions from row and column", () => {
    const scale = 0.34;
    const idle = CODEX_ANIMATIONS.idle;
    expect(codexFramePosition("idle", 0, scale).x).toBeCloseTo(0);
    expect(codexFramePosition("idle", 0, scale).y).toBeCloseTo(0);
    expect(codexFramePosition("idle", 1, scale).x).toBeCloseTo(-65.28);
    expect(codexFramePosition("idle", 0, scale).y).toBeCloseTo(-(idle.row * 208 * scale));
  });
});
