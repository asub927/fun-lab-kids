import { describe, expect, it } from "vitest";
import {
  CODEX_ANIMATIONS,
  codexFramePosition,
  getCodexPetPackage,
  moodToCodexAction,
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

  it("maps moods to Codex animation rows", () => {
    expect(moodToCodexAction("idle", "right")).toBe("idle");
    expect(moodToCodexAction("working", "right")).toBe("running-right");
    expect(moodToCodexAction("working", "left")).toBe("running-left");
    expect(moodToCodexAction("celebrating", "right")).toBe("jumping");
    expect(moodToCodexAction("waiting", "right")).toBe("waiting");
    expect(moodToCodexAction("waving", "right")).toBe("waving");
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
