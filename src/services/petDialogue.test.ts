import { describe, expect, it } from "vitest";
import { emptyGamificationState } from "./gamification";
import { pickPetCelebrationLine } from "./petDialogue";
import type { ProgressStore } from "./progress";

function makeStore(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
    ...overrides,
  };
}

describe("pickPetCelebrationLine", () => {
  it("interpolates the learner name when present in template", () => {
    const store = makeStore({ profile: { name: "Maya" } });
    const line = pickPetCelebrationLine("dog", "correct", store, 0);
    expect(line.length).toBeGreaterThan(3);
  });

  it("returns mastery lines for big wins", () => {
    const store = makeStore();
    const line = pickPetCelebrationLine("rabbit", "mastery", store, 0);
    expect(line.toLowerCase()).toMatch(/master|hop|win/);
  });

  it("returns achievement lines for badge unlocks", () => {
    const store = makeStore();
    const line = pickPetCelebrationLine("cat", "achievement", store, 0);
    expect(line.toLowerCase()).toMatch(/badge|meow/);
  });
});
