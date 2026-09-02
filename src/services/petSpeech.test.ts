import { describe, expect, it } from "vitest";
import { getCharacterIdForPet } from "../data/pets";
import { emptyGamificationState } from "./gamification";
import {
  labNameForPath,
  speechForCelebration,
  speechForCheck,
  speechForRoute,
  speechForWave,
  subjectForSpeech,
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

describe("subjectForSpeech", () => {
  it("prefers the active lab subject", () => {
    expect(subjectForSpeech("/lab/W.2.1", "math")).toBe("math");
  });

  it("derives ELA subject from lab routes", () => {
    expect(subjectForSpeech("/lab/W.2.1")).toBe("ela");
  });
});

describe("labNameForPath", () => {
  it("returns Fun Lab for hub routes", () => {
    expect(labNameForPath("/")).toBe("Fun Lab");
    expect(labNameForPath("/grade-2")).toBe("Fun Lab");
    expect(labNameForPath("/grade-2/progress")).toBe("Fun Lab");
  });

  it("returns subject lab names for subject routes", () => {
    expect(labNameForPath("/grade-2/math")).toBe("Math Lab");
    expect(labNameForPath("/grade-2/ela")).toBe("Word Lab");
    expect(labNameForPath("/grade-2/science")).toBe("Science Lab");
  });
});

describe("speechForRoute", () => {
  it("greets on the hub with Fun Lab", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2", "dog", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Jordan");
    expect(line).toContain("Fun Lab");
    expect(line).not.toContain("Math Lab");
  });

  it("welcomes on math subject pages", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/math", "dog", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Math Lab");
  });

  it("uses Word Lab on ELA pages regardless of pet species", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/ela", "dog", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Word Lab");
    expect(line).not.toContain("Math Lab");
  });

  it("uses reading tone on ELA subject browse regardless of pet species", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/ela", "dog", store);
    expect(line).toMatch(/reading|pages|sentence|story/i);
    expect(line).not.toMatch(/keep counting|numbers|solve/i);
  });

  it("uses Science Lab on science pages regardless of pet species", () => {
    const store = makeStore();
    const line = speechForRoute("/grade-2/science", "dog", store);
    expect(line).toBeTruthy();
    expect(line).toContain("Science Lab");
    expect(line).not.toContain("Math Lab");
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
  it("uses buddy voice for correct and encourage lines when subject is unknown", () => {
    const store = makeStore();
    const correct = speechForCheck(true, "/", "cat", store, 3);
    const encourage = speechForCheck(false, "/", "cat", store, 3);
    expect(correct).not.toBe(encourage);
    expect(correct.length).toBeGreaterThan(5);
  });

  it("uses ELA encourage lines in ELA labs regardless of pet species", () => {
    const store = makeStore();
    const line = speechForCheck(false, "/lab/W.2.1", "dog", store, 2);
    expect(line).toMatch(/stories|reader|story|text|sentence/i);
    expect(line).not.toMatch(/mathematician|math|digits|count/i);
  });

  it("uses math encourage lines in math labs", () => {
    const store = makeStore();
    const line = speechForCheck(false, "/lab/NC.2.NBT.1", "cat", store, 2);
    expect(line).toMatch(/mathematician|check your work|try again/i);
  });

  it("uses ELA correct lines in ELA labs regardless of pet species", () => {
    const store = makeStore();
    const line = speechForCheck(true, "/lab/W.2.1", "dog", store, 2);
    expect(line).toMatch(/reading|storyteller|words|rhythm/i);
    expect(line).not.toMatch(/cracked it|number sense|digits/i);
  });
});

describe("speechForCelebration", () => {
  it("speaks mastery lines for the chosen buddy when subject is unknown", () => {
    const store = makeStore();
    const line = speechForCelebration(
      { xpEarned: 10, newAchievements: [], streakDays: 1, isNewMastery: true },
      "/",
      "dog",
      store,
      2,
    );
    expect(line.length).toBeGreaterThan(10);
  });

  it("uses ELA mastery lines in ELA labs", () => {
    const store = makeStore();
    const line = speechForCelebration(
      { xpEarned: 10, newAchievements: [], streakDays: 1, isNewMastery: true },
      "/lab/W.2.1",
      "dog",
      store,
      2,
    );
    expect(line).toMatch(/storyteller|reader|reading|word lab/i);
    expect(line).not.toMatch(/math shell|mathematician/i);
  });
});

describe("speechForWave", () => {
  it("rotates hub greetings when tapped", () => {
    const store = makeStore();
    const a = speechForWave("/grade-2", "rabbit", store, 0);
    const b = speechForWave("/grade-2", "rabbit", store, 1);
    expect(a).not.toBe(b);
  });

  it("uses the current route lab name", () => {
    const store = makeStore();
    const line = speechForWave("/grade-2/ela", "dog", store, 0);
    expect(line).toContain("Word Lab");
    expect(line).not.toContain("Math Lab");
  });
});
