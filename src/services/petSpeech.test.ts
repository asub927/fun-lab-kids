import { describe, expect, it } from "vitest";
import { getCharacterIdForPet } from "../data/pets";
import { emptyGamificationState } from "./gamification";
import {
  speechForCelebration,
  speechForCheck,
  speechForRoute,
  speechForWave,
} from "./petSpeech";
import type { ProgressStore } from "./progress";

function makeStore(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 2,
    profile: { name: "Jordan" },
    gamification: emptyGamificationState(),
    progress: {},
    ...overrides,
  };
}

describe("getCharacterIdForPet", () => {
  it("maps pet species to crew character ids", () => {
    expect(getCharacterIdForPet("cat")).toBe("ripple");
    expect(getCharacterIdForPet("dog")).toBe("digits");
    expect(getCharacterIdForPet("rabbit")).toBe("spark");
  });
});

describe("speechForRoute", () => {
  it("greets on the hub", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2", "cat", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Jordan");
  });

  it("welcomes on subject pages", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/math", "dog", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Math Lab");
  });

  it("hints on progress when achievements remain", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/progress", "rabbit", store);
    expect(line).toBeTruthy();
  });

  it("returns null for lab routes", () => {
    const store = makeStore();
    expect(speechForRoute("/lab/2.OA.1", "cat", store)).toBeNull();
  });
});

describe("speechForCheck", () => {
  it("uses buddy voice for correct and encourage lines", () => {
    const store = makeStore();
    const correct = speechForCheck(true, "cat", store, 3);
    const encourage = speechForCheck(false, "cat", store, 3);
    expect(correct).not.toBe(encourage);
    expect(correct.length).toBeGreaterThan(5);
  });
});

describe("speechForCelebration", () => {
  it("speaks mastery lines for the chosen buddy", () => {
    const store = makeStore();
    const line = speechForCelebration(
      { xpEarned: 10, newAchievements: [], streakDays: 1, isNewMastery: true },
      "dog",
      store,
      2,
    );
    expect(line.length).toBeGreaterThan(10);
  });
});

describe("speechForWave", () => {
  it("rotates hub greetings when tapped", () => {
    const store = makeStore();
    const a = speechForWave("rabbit", store, 0);
    const b = speechForWave("rabbit", store, 1);
    expect(a).not.toBe(b);
  });
});
