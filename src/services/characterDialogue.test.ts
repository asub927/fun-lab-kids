import { describe, expect, it } from "vitest";
import { emptyGamificationState } from "./gamification";
import {
  getCharacterIdForSubject,
  pickCharacterLine,
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
  it("uses Ripple for scoreboard hints", () => {
    const store = makeStore({ profile: { name: "Leo" } });
    const line = pickScoreboardHintLine(store, {
      id: "word-captain",
      title: "Word Captain",
      description: "Master 5 ELA standards",
      icon: "📖",
      evaluate: () => false,
    }, 2);
    expect(line).toContain("Word Captain");
    expect(line).toContain("Leo");
  });
});
