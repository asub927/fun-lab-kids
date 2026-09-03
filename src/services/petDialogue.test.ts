import { describe, expect, it } from "vitest";
import { emptyGamificationState } from "./gamification";
import { pickPetCelebrationCue, pickPetCelebrationLine } from "./petDialogue";
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

describe("pickPetCelebrationCue", () => {
  it("returns paired text and audio for each species", () => {
    const store = makeStore();
    const dog = pickPetCelebrationCue("dog", "correct", store, 1);
    expect(dog.text).toContain("Woof");
    expect(dog.audio).toBe("/pets/voice/dog/correct-02.mp3");

    const cat = pickPetCelebrationCue("cat", "correct", store, 0);
    expect(cat.text).toContain("Purrr");
    expect(cat.audio).toBe("/pets/voice/cat/correct-01.mp3");

    const rabbit = pickPetCelebrationCue("rabbit", "correct", store, 0);
    expect(rabbit.text).toContain("Hop");
    expect(rabbit.audio).toBe("/pets/voice/rabbit/correct-01.mp3");
  });

  it("rotates deterministically through the pool", () => {
    const store = makeStore();
    const a = pickPetCelebrationCue("dog", "mastery", store, 1);
    const b = pickPetCelebrationCue("dog", "mastery", store, 1);
    const c = pickPetCelebrationCue("dog", "mastery", store, 0);
    expect(a).toEqual(b);
    expect(a.id).not.toBe(c.id);
    expect(a.audio).not.toBe(c.audio);
  });

  it("returns mastery lines for big wins", () => {
    const store = makeStore();
    const line = pickPetCelebrationLine("rabbit", "mastery", store, 0);
    expect(line.toLowerCase()).toMatch(/master|hop|win/);
  });

  it("returns achievement lines for badge unlocks", () => {
    const store = makeStore();
    const cue = pickPetCelebrationCue("cat", "achievement", store, 0);
    expect(cue.text.toLowerCase()).toMatch(/badge|meow/);
    expect(cue.audio).toBe("/pets/voice/cat/achievement-01.mp3");
  });

  it("pairs every celebration context with an MP3 path for each pet", () => {
    const store = makeStore();
    for (const species of ["dog", "cat", "rabbit"] as const) {
      for (const context of ["correct", "mastery", "achievement"] as const) {
        const cue = pickPetCelebrationCue(species, context, store, 0);
        expect(cue.audio).toMatch(
          new RegExp(`^/pets/voice/${species}/${context}-\\d{2}\\.mp3$`),
        );
        expect(cue.text.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
