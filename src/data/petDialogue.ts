import type { PetSpeciesId } from "./pets";

export type PetDialogueContext = "correct" | "mastery" | "achievement";

export type PetCelebrationCue = {
  id: string;
  text: string;
  /** Public URL path to a pre-recorded voice clip matching `text`. */
  audio: string;
};

function cue(
  speciesId: PetSpeciesId,
  context: PetDialogueContext,
  index: number,
  text: string,
): PetCelebrationCue {
  const slot = String(index + 1).padStart(2, "0");
  return {
    id: `${speciesId}-${context}-${slot}`,
    text,
    audio: `/pets/voice/${speciesId}/${context}-${slot}.mp3`,
  };
}

export const PET_DIALOGUE_POOLS: Record<
  PetSpeciesId,
  Record<PetDialogueContext, PetCelebrationCue[]>
> = {
  dog: {
    correct: [
      cue("dog", "correct", 0, "Yes! Good job!"),
      cue("dog", "correct", 1, "Woof! You got it!"),
      cue("dog", "correct", 2, "That's the one! Nice work!"),
      cue("dog", "correct", 3, "Tail wag! You nailed it!"),
    ],
    mastery: [
      cue("dog", "mastery", 0, "Skill mastered! Woof woof!"),
      cue("dog", "mastery", 1, "You did it! I'm so proud!"),
    ],
    achievement: [
      cue("dog", "achievement", 0, "New badge! Woof!"),
      cue("dog", "achievement", 1, "Look at you go!"),
    ],
  },
  cat: {
    correct: [
      cue("cat", "correct", 0, "Purrrfect!"),
      cue("cat", "correct", 1, "Meow! That's right!"),
      cue("cat", "correct", 2, "Nice one, friend!"),
      cue("cat", "correct", 3, "You got it! Yum!"),
    ],
    mastery: [
      cue("cat", "mastery", 0, "Mastered! Meow!"),
      cue("cat", "mastery", 1, "Amazing work!"),
    ],
    achievement: [
      cue("cat", "achievement", 0, "A new badge! Meow!"),
      cue("cat", "achievement", 1, "So sweet!"),
    ],
  },
  rabbit: {
    correct: [
      cue("rabbit", "correct", 0, "Hop hop hooray!"),
      cue("rabbit", "correct", 1, "You got it! Bounce!"),
      cue("rabbit", "correct", 2, "Woo hoo! Nice one!"),
      cue("rabbit", "correct", 3, "That's right! Hop hop!"),
    ],
    mastery: [
      cue("rabbit", "mastery", 0, "Skill mastered! Hop hop!"),
      cue("rabbit", "mastery", 1, "Big win! So bouncy!"),
    ],
    achievement: [
      cue("rabbit", "achievement", 0, "Badge unlocked! Hop!"),
      cue("rabbit", "achievement", 1, "You did it! Yay!"),
    ],
  },
};
