import { beforeEach, describe, expect, it } from "vitest";
import { deriveAmbientMood, reactionFromAppEvent } from "./petActivity";
import {
  getPetSpeciesId,
  isPetVisible,
  loadPetPrefs,
  setPetSpecies,
  setPetVisible,
} from "./pet";

const store = new Map<string, string>();
const STORAGE_KEY = "funlab-pet";
const LEGACY_STORAGE_KEY = "inquiry-island-pet";

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
  it("defaults to visible dog", () => {
    const prefs = loadPetPrefs();
    expect(prefs.visible).toBe(true);
    expect(prefs.speciesId).toBe("dog");
    expect(prefs.version).toBe(3);
    expect(isPetVisible()).toBe(true);
    expect(getPetSpeciesId()).toBe("dog");
  });

  it("can hide and show the pet", () => {
    setPetVisible(false);
    expect(isPetVisible()).toBe(false);
    setPetVisible(true);
    expect(isPetVisible()).toBe(true);
  });

  it("persists species choice", () => {
    setPetSpecies("cat");
    expect(getPetSpeciesId()).toBe("cat");
    expect(loadPetPrefs().speciesId).toBe("cat");
    setPetSpecies("rabbit");
    expect(getPetSpeciesId()).toBe("rabbit");
  });

  it("preserves species when toggling visibility", () => {
    setPetSpecies("cat");
    setPetVisible(false);
    expect(loadPetPrefs()).toEqual({ version: 3, visible: false, speciesId: "cat" });
    setPetVisible(true);
    expect(loadPetPrefs().speciesId).toBe("cat");
  });

  it("migrates legacy pebble species to dog", () => {
    store.set(
      LEGACY_STORAGE_KEY,
      JSON.stringify({ version: 2, visible: true, speciesId: "pebble" }),
    );
    expect(loadPetPrefs().speciesId).toBe("dog");
    expect(loadPetPrefs().version).toBe(3);
    expect(store.has(STORAGE_KEY)).toBe(true);
  });

  it("migrates legacy coral and sprout species", () => {
    store.set(
      STORAGE_KEY,
      JSON.stringify({ version: 2, visible: true, speciesId: "coral" }),
    );
    expect(loadPetPrefs().speciesId).toBe("cat");

    store.set(
      STORAGE_KEY,
      JSON.stringify({ version: 2, visible: true, speciesId: "sprout" }),
    );
    expect(loadPetPrefs().speciesId).toBe("rabbit");
  });
});
