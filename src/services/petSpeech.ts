import type { PetSpeciesId } from "../data/pets";
import { isPetSoundEnabled } from "./pet";

let active = false;

export function isPetSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function voiceForSpecies(speciesId: PetSpeciesId): Pick<SpeechSynthesisUtterance, "pitch" | "rate"> {
  switch (speciesId) {
    case "dog":
      return { pitch: 1.15, rate: 1.05 };
    case "cat":
      return { pitch: 1.25, rate: 0.95 };
    case "rabbit":
      return { pitch: 1.35, rate: 1.1 };
    default:
      return { pitch: 1.1, rate: 1 };
  }
}

export function speakPetLine(text: string, options: { speciesId: PetSpeciesId }): boolean {
  const trimmed = text.trim();
  if (!trimmed || !isPetSoundEnabled() || !isPetSpeechSupported()) return false;

  stopPetSpeech();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  const voice = voiceForSpecies(options.speciesId);
  utterance.pitch = voice.pitch;
  utterance.rate = voice.rate;
  utterance.volume = 0.85;
  utterance.onend = () => {
    active = false;
  };
  utterance.onerror = () => {
    active = false;
  };

  active = true;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopPetSpeech(): void {
  if (isPetSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
  active = false;
}

export function isPetSpeaking(): boolean {
  return active;
}
