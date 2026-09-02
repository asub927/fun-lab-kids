import { beforeEach, describe, expect, it, vi } from "vitest";
import { deriveAmbientMood, reactionFromAppEvent } from "./petActivity";
import { emptyGamificationState } from "./gamification";
import { pickPetCelebrationLine } from "./petDialogue";
import type { ProgressStore } from "./progress";
import {
  getPetDisplayName,
  getPetSpeciesId,
  isPetSoundEnabled,
  isPetVisible,
  loadPetPrefs,
  savePetPrefs,
  setPetSoundEnabled,
  setPetSpecies,
  setPetVisible,
} from "./pet";
import { isPetSpeechSupported, playPetCelebrationCue, stopPetSpeech } from "./petSpeech";

const store = new Map<string, string>();
const STORAGE_KEY = "funlab-pet";
const LEGACY_STORAGE_KEY = "inquiry-island-pet";

function makeProgressStore(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
    ...overrides,
  };
}

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
  it("defaults to visible dog named Digits with sound on", () => {
    const prefs = loadPetPrefs();
    expect(prefs.visible).toBe(true);
    expect(prefs.speciesId).toBe("dog");
    expect(prefs.soundEnabled).toBe(true);
    expect(prefs.version).toBe(4);
    expect(isPetVisible()).toBe(true);
    expect(getPetSpeciesId()).toBe("dog");
    expect(getPetDisplayName("dog")).toBe("Digits");
    expect(isPetSoundEnabled()).toBe(true);
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
    expect(getPetDisplayName("cat")).toBe("Ripple");
    expect(loadPetPrefs().speciesId).toBe("cat");
    setPetSpecies("rabbit");
    expect(getPetSpeciesId()).toBe("rabbit");
    expect(getPetDisplayName("rabbit")).toBe("Spark");
  });

  it("can toggle celebration voice", () => {
    setPetSoundEnabled(false);
    expect(isPetSoundEnabled()).toBe(false);
    expect(loadPetPrefs().soundEnabled).toBe(false);
    setPetSoundEnabled(true);
    expect(isPetSoundEnabled()).toBe(true);
  });

  it("preserves species when toggling visibility", () => {
    setPetSpecies("cat");
    setPetVisible(false);
    expect(loadPetPrefs()).toEqual({
      version: 4,
      visible: false,
      speciesId: "cat",
      soundEnabled: true,
    });
    setPetVisible(true);
    expect(loadPetPrefs().speciesId).toBe("cat");
  });

  it("migrates legacy pebble species to dog", () => {
    store.set(
      LEGACY_STORAGE_KEY,
      JSON.stringify({ version: 2, visible: true, speciesId: "pebble" }),
    );
    expect(loadPetPrefs().speciesId).toBe("dog");
    expect(loadPetPrefs().version).toBe(4);
    expect(loadPetPrefs().soundEnabled).toBe(true);
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

describe("pickPetCelebrationLine", () => {
  it("returns species-specific celebration lines", () => {
    const progress = makeProgressStore();
    expect(pickPetCelebrationLine("dog", "correct", progress, 1)).toContain("Woof");
    expect(pickPetCelebrationLine("cat", "correct", progress, 0)).toContain("Purrr");
    expect(pickPetCelebrationLine("rabbit", "correct", progress, 0)).toContain("Hop");
  });

  it("selects deterministically from the pool", () => {
    const progress = makeProgressStore();
    const a = pickPetCelebrationLine("dog", "mastery", progress, 1);
    const b = pickPetCelebrationLine("dog", "mastery", progress, 1);
    const c = pickPetCelebrationLine("dog", "mastery", progress, 0);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});

describe("petSpeech", () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();
  let lastAudio: {
    src: string;
    volume: number;
    preload: string;
    currentTime: number;
    paused: boolean;
    ended: boolean;
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    addEventListener: ReturnType<typeof vi.fn>;
  } | null = null;

  beforeEach(() => {
    play.mockClear();
    pause.mockClear();
    lastAudio = null;

    class MockAudio {
      src = "";
      volume = 1;
      preload = "";
      currentTime = 0;
      paused = false;
      ended = false;
      play = play;
      pause = pause;
      addEventListener = vi.fn();
      constructor(src?: string) {
        if (src) this.src = src;
        lastAudio = this;
      }
    }

    Object.defineProperty(globalThis, "Audio", {
      configurable: true,
      writable: true,
      value: MockAudio,
    });
    savePetPrefs({
      version: 4,
      visible: true,
      speciesId: "dog",
      soundEnabled: true,
    });
  });

  it("detects audio playback support", () => {
    expect(isPetSpeechSupported()).toBe(true);
  });

  it("plays recorded celebration clips when sound is enabled", () => {
    const played = playPetCelebrationCue({
      id: "dog-correct-02",
      text: "Woof! You got it!",
      audio: "/pets/voice/dog/correct-02.mp3",
    });
    expect(played).toBe(true);
    expect(lastAudio?.src).toBe("/pets/voice/dog/correct-02.mp3");
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("skips playback when sound is disabled", () => {
    savePetPrefs({
      version: 4,
      visible: true,
      speciesId: "dog",
      soundEnabled: false,
    });
    const played = playPetCelebrationCue({
      id: "dog-correct-02",
      text: "Woof! You got it!",
      audio: "/pets/voice/dog/correct-02.mp3",
    });
    expect(played).toBe(false);
    expect(play).not.toHaveBeenCalled();
  });

  it("stops active playback", () => {
    playPetCelebrationCue({
      id: "rabbit-correct-01",
      text: "Hop hop hooray!",
      audio: "/pets/voice/rabbit/correct-01.mp3",
    });
    stopPetSpeech();
    expect(pause).toHaveBeenCalled();
    expect(lastAudio?.currentTime).toBe(0);
  });
});
