import { beforeEach, describe, expect, it } from "vitest";
import { checksToNextStage, stageFromChecks } from "../data/pets";
import {
  careForPet,
  derivePetMood,
  getPetLine,
  getPetSnapshot,
  hatchPet,
  loadPet,
} from "./pet";

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

describe("island pet", () => {
  it("starts unhatched", () => {
    const save = loadPet();
    expect(save.speciesId).toBeNull();
    expect(getPetSnapshot(save).hatched).toBe(false);
  });

  it("hatches a species and accepts care", () => {
    const hatched = hatchPet("coral", "Finny");
    expect(hatched.speciesId).toBe("coral");
    expect(hatched.nickname).toBe("Finny");

    const cared = careForPet();
    expect(cared.careCount).toBe(2);

    const snapshot = getPetSnapshot(cared);
    expect(snapshot.displayName).toBe("Finny");
    expect(snapshot.hatched).toBe(true);
  });

  it("maps checks to growth stages", () => {
    expect(stageFromChecks(0)).toBe("egg");
    expect(stageFromChecks(5)).toBe("hatchling");
    expect(stageFromChecks(25)).toBe("buddy");
    expect(stageFromChecks(50)).toBe("champion");
    expect(checksToNextStage(18)).toEqual({ next: "buddy", remaining: 2 });
  });

  it("derives moods from recent activity", () => {
    expect(
      derivePetMood({ lastCheckOk: true, isCelebrating: false, lastCaredAt: Date.now() }),
    ).toBe("celebrating");
    expect(
      derivePetMood({ lastCheckOk: false, isCelebrating: false, lastCaredAt: Date.now() }),
    ).toBe("working");
    expect(
      derivePetMood({
        lastCheckOk: null,
        isCelebrating: false,
        lastCaredAt: Date.now() - 1000 * 60 * 60 * 13,
      }),
    ).toBe("hungry");
  });

  it("returns kid-friendly lines with the pet name", () => {
    const line = getPetLine("celebrating", "Pebble", 0);
    expect(line).toContain("Pebble");
  });
});
