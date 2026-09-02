import { describe, expect, it } from "vitest";
import { emptyGamificationState } from "./gamification";
import {
  getCharacterIdForSubject,
  pickBuddyLine,
  pickCharacterLine,
  pickCharacterLineById,
  pickHubGreetingLine,
  pickScoreboardHintLine,
  pickSubjectWelcomeLine,
} from "./characterDialogue";
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

describe("getCharacterIdForSubject", () => {
  it("maps subjects to the correct character", () => {
    expect(getCharacterIdForSubject("ela")).toBe("ripple");
    expect(getCharacterIdForSubject("math")).toBe("digits");
    expect(getCharacterIdForSubject("science")).toBe("spark");
  });
});

describe("pickCharacterLine", () => {
  it("interpolates the learner name", () => {
    const store = makeStore({ profile: { name: "Maya" } });
    const line = pickCharacterLine("ela", "hubGreeting", store, {}, 0);
    expect(line).toContain("Maya");
    expect(line).not.toContain("{name}");
  });

  it("falls back to Jordan when name is missing", () => {
    const store = makeStore();
    const line = pickCharacterLine("math", "hubGreeting", store, {}, 0);
    expect(line).toContain("Jordan");
  });

  it("selects deterministically from the pool", () => {
    const store = makeStore();
    const a = pickCharacterLine("science", "labCorrect", store, {}, 2);
    const b = pickCharacterLine("science", "labCorrect", store, {}, 2);
    const c = pickCharacterLine("science", "labCorrect", store, {}, 3);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("interpolates subject progress vars", () => {
    const store = makeStore({ profile: { name: "Kai" } });
    const line = pickSubjectWelcomeLine("ela", store, 3, 10, 0);
    expect(line).toContain("3");
    expect(line).toContain("10");
  });
});

describe("pickCharacterLineById", () => {
  it("speaks in the chosen character voice", () => {
    const store = makeStore({ profile: { name: "Sam" } });
    const ripple = pickCharacterLineById("ripple", "hubGreeting", store, {}, 0);
    const digits = pickCharacterLineById("digits", "hubGreeting", store, {}, 0);
    expect(ripple).toContain("Sam");
    expect(digits).toContain("Sam");
    expect(ripple).not.toBe(digits);
  });
});

describe("pickBuddyLine", () => {
  it("maps cat pet to Ripple dialogue", () => {
    const store = makeStore({ profile: { name: "Alex" } });
    const line = pickBuddyLine("cat", "hubGreeting", store, {}, 0);
    expect(line).toContain("Alex");
    expect(pickCharacterLineById("ripple", "hubGreeting", store, {}, 0)).toBe(line);
  });

  it("maps dog pet to Digits dialogue", () => {
    const store = makeStore();
    const line = pickBuddyLine("dog", "labCorrect", store, {}, 1);
    expect(line).toBe(pickCharacterLineById("digits", "labCorrect", store, {}, 1));
  });
});

describe("pickHubGreetingLine", () => {
  it("returns a non-empty greeting per subject", () => {
    const store = makeStore({ profile: { name: "Emma" } });
    for (const subject of ["math", "ela", "science"] as const) {
      const line = pickHubGreetingLine(subject, store, 0);
      expect(line.length).toBeGreaterThan(10);
      expect(line).toContain("Emma");
    }
  });
});

describe("pickScoreboardHintLine", () => {
  it("uses the chosen buddy for scoreboard hints", () => {
    const store = makeStore({ profile: { name: "Leo" } });
    const achievement = {
      id: "word-captain",
      title: "Word Captain",
      description: "Master 5 ELA standards",
      icon: "📖",
      evaluate: () => false,
    };
    const rippleLine = pickScoreboardHintLine(store, achievement, "cat", 2);
    const digitsLine = pickScoreboardHintLine(store, achievement, "dog", 2);
    expect(rippleLine).toContain("Word Captain");
    expect(rippleLine).toContain("Leo");
    expect(digitsLine).toContain("Word Captain");
    expect(rippleLine).not.toBe(digitsLine);
  });
});
