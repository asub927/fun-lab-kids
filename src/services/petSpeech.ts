import type { CelebrationPayload } from "../context/AppContext";
import type { PetCelebrationCue } from "../data/petDialogue";
import { getCharacterBySubject } from "../data/characters";
import { getCharacterIdForPet, type PetSpeciesId } from "../data/pets";
import { listGrade2Standards } from "../data/standards";
import type { Subject } from "../types";
import { pickBuddyLine, pickCharacterLineById, type DialogueVars } from "./characterDialogue";
import type { ProgressStore } from "./progress";
import { getNextAchievement } from "./progressStats";
import { isPetSoundEnabled } from "./pet";

export const PET_SPEECH_MS = 4500;

let activeAudio: HTMLAudioElement | null = null;

function parseSubjectFromPath(pathname: string): Subject | null {
  const match = pathname.match(/^\/grade-2\/(math|ela|science)$/);
  return match ? (match[1] as Subject) : null;
}

export function labNameForPath(pathname: string): string {
  const subject = parseSubjectFromPath(pathname);
  if (subject) return getCharacterBySubject(subject).lab;
  return "Fun Lab";
}

function dialogueVarsForPath(pathname: string, extra: DialogueVars = {}): DialogueVars {
  return { labName: labNameForPath(pathname), ...extra };
}

export function isPetSpeechSupported(): boolean {
  return typeof Audio !== "undefined";
}

export function playPetCelebrationCue(cue: PetCelebrationCue): boolean {
  const audioSrc = cue.audio.trim();
  if (!audioSrc || !isPetSoundEnabled() || !isPetSpeechSupported()) return false;

  stopPetSpeech();

  const audio = new Audio(audioSrc);
  audio.preload = "auto";
  audio.volume = 0.9;
  activeAudio = audio;

  void audio.play().catch(() => {
    if (activeAudio === audio) activeAudio = null;
  });

  audio.addEventListener(
    "ended",
    () => {
      if (activeAudio === audio) activeAudio = null;
    },
    { once: true },
  );

  audio.addEventListener(
    "error",
    () => {
      if (activeAudio === audio) activeAudio = null;
    },
    { once: true },
  );

  return true;
}

export function stopPetSpeech(): void {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

export function isPetSpeaking(): boolean {
  return activeAudio !== null && !activeAudio.paused && !activeAudio.ended;
}

export function speechForRoute(
  pathname: string,
  speciesId: PetSpeciesId,
  store: ProgressStore,
): string | null {
  const routeVars = dialogueVarsForPath(pathname);

  if (pathname === "/" || pathname === "/grade-2") {
    const seed = store.gamification.currentStreak;
    return pickBuddyLine(speciesId, "hubGreeting", store, routeVars, seed);
  }

  const subject = parseSubjectFromPath(pathname);
  if (subject) {
    const codes = listGrade2Standards(subject).map((s) => s.code);
    const done = codes.filter((c) => store.progress[c]?.completed).length;
    const total = codes.length;
    return pickBuddyLine(speciesId, "subjectWelcome", store, { ...routeVars, done, total }, done);
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
  pathname: string,
  speciesId: PetSpeciesId,
  store: ProgressStore,
  seed: number,
): string {
  return pickBuddyLine(speciesId, "hubGreeting", store, dialogueVarsForPath(pathname), seed);
}
