import type { CelebrationPayload } from "../context/AppContext";
import { getCharacterIdForPet, type PetSpeciesId } from "../data/pets";
import { listGrade2Standards } from "../data/standards";
import type { Subject } from "../types";
import { pickBuddyLine, pickCharacterLineById } from "./characterDialogue";
import type { ProgressStore } from "./progress";
import { getNextAchievement } from "./progressStats";

export const PET_SPEECH_MS = 4500;

function parseSubjectFromPath(pathname: string): Subject | null {
  const match = pathname.match(/^\/grade-2\/(math|ela|science)$/);
  return match ? (match[1] as Subject) : null;
}

export function speechForRoute(
  pathname: string,
  speciesId: PetSpeciesId,
  store: ProgressStore,
): string | null {
  if (pathname === "/" || pathname === "/grade-2") {
    const seed = store.gamification.currentStreak;
    return pickBuddyLine(speciesId, "hubGreeting", store, {}, seed);
  }

  const subject = parseSubjectFromPath(pathname);
  if (subject) {
    const codes = listGrade2Standards(subject).map((s) => s.code);
    const done = codes.filter((c) => store.progress[c]?.completed).length;
    const total = codes.length;
    return pickBuddyLine(speciesId, "subjectWelcome", store, { done, total }, done);
  }

  if (pathname === "/grade-2/progress") {
    const next = getNextAchievement(store);
    if (!next) return null;
    return pickBuddyLine(
      speciesId,
      "scoreboardHint",
      store,
      { achievement: next.title },
      store.gamification.totalXp,
    );
  }

  return null;
}

export function speechForCheck(
  ok: boolean,
  speciesId: PetSpeciesId,
  store: ProgressStore,
  checkCount: number,
): string {
  const context = ok ? "labCorrect" : "labEncourage";
  return pickBuddyLine(speciesId, context, store, {}, checkCount);
}

export function speechForCelebration(
  celebration: CelebrationPayload,
  speciesId: PetSpeciesId,
  store: ProgressStore,
  checkCount: number,
): string {
  const characterId = getCharacterIdForPet(speciesId);
  if (celebration.isNewMastery) {
    return pickCharacterLineById(characterId, "mastery", store, {}, checkCount);
  }
  const first = celebration.newAchievements[0];
  if (first) {
    return pickBuddyLine(
      speciesId,
      "achievement",
      store,
      { achievement: first.title },
      checkCount,
    );
  }
  return pickCharacterLineById(characterId, "mastery", store, {}, checkCount);
}

export function speechForWave(
  speciesId: PetSpeciesId,
  store: ProgressStore,
  seed: number,
): string {
  return pickBuddyLine(speciesId, "hubGreeting", store, {}, seed);
}
