import type { PetSpeciesId } from "./pets";

export type PetDialogueContext = "correct" | "mastery" | "achievement";

export const PET_DIALOGUE_POOLS: Record<PetSpeciesId, Record<PetDialogueContext, string[]>> = {
  dog: {
    correct: [
      "Yes! Good job!",
      "Woof! You got it!",
      "That's the one! Nice work!",
      "Tail wag! You nailed it!",
    ],
    mastery: [
      "Skill mastered! Woof woof!",
      "You did it! I'm so proud!",
    ],
    achievement: [
      "New badge! Woof!",
      "Look at you go!",
    ],
  },
  cat: {
    correct: [
      "Purrrfect!",
      "Meow! That's right!",
      "Nice one, friend!",
      "You got it! Yum!",
    ],
    mastery: [
      "Mastered! Meow!",
      "Amazing work!",
    ],
    achievement: [
      "A new badge! Meow!",
      "So sweet!",
    ],
  },
  rabbit: {
    correct: [
      "Hop hop hooray!",
      "You got it! Bounce!",
      "Woo hoo! Nice one!",
      "That's right! Hop hop!",
    ],
    mastery: [
      "Skill mastered! Hop hop!",
      "Big win! So bouncy!",
    ],
    achievement: [
      "Badge unlocked! Hop!",
      "You did it! Yay!",
    ],
  },
};
