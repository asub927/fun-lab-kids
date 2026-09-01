import { beforeEach, describe, expect, it } from "vitest";
import { speciesForSubject } from "../data/pets";
import { deriveAmbientMood, reactionFromAppEvent } from "./petActivity";
import { isPetVisible, loadPetPrefs, setPetVisible } from "./pet";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
    },
  });
});

describe("ambient pet activity", () => {
  it("maps subject to a default creature", () => {
    expect(speciesForSubject("math")).toBe("pebble");
    expect(speciesForSubject("ela")).toBe("coral");
    expect(speciesForSubject("science")).toBe("sprout");
    expect(speciesForSubject(null)).toBe("pebble");
  });

  it("derives celebrating and working from timed reactions", () => {
    expect(
      deriveAmbientMood({ reaction: "celebrating", inLab: true, needsAnswer: true }),
    ).toBe("celebrating");
    expect(deriveAmbientMood({ reaction: "working", inLab: false })).toBe("working");
    expect(deriveAmbientMood({ reaction: "waving", inLab: false })).toBe("waving");
  });

  it("stays calm in labs unless waiting for an answer", () => {
    expect(deriveAmbientMood({ reaction: null, inLab: true, needsAnswer: true })).toBe("waiting");
    expect(deriveAmbientMood({ reaction: null, inLab: true, needsAnswer: false })).toBe("idle");
    expect(deriveAmbientMood({ reaction: null, inLab: false })).toBe("idle");
  });

  it("builds reactions from check events", () => {
    expect(reactionFromAppEvent({ lastCheckOk: true, isCelebrating: false })).toBe("celebrating");
    expect(reactionFromAppEvent({ lastCheckOk: false, isCelebrating: false })).toBe("working");
    expect(reactionFromAppEvent({ lastCheckOk: null, isCelebrating: true })).toBe("celebrating");
    expect(reactionFromAppEvent({ lastCheckOk: null, isCelebrating: false })).toBeNull();
  });
});

describe("ambient pet prefs", () => {
  it("defaults to visible and can hide", () => {
    expect(loadPetPrefs().visible).toBe(true);
    expect(isPetVisible()).toBe(true);
    setPetVisible(false);
    expect(isPetVisible()).toBe(false);
  });
});
