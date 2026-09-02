import type { PetCelebrationCue } from "../data/petDialogue";
import { isPetSoundEnabled } from "./pet";

let activeAudio: HTMLAudioElement | null = null;

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

/** @deprecated Use playPetCelebrationCue with a recorded clip. */
export function speakPetLine(_text: string, _options: { speciesId: string }): boolean {
  return false;
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
