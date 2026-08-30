import type { Subject } from "../types";

export type CharacterId = "ripple" | "digits" | "spark";

export type CharacterMood = "idle" | "happy" | "cheering" | "thinking";

export type Character = {
  id: CharacterId;
  name: string;
  subject: Subject;
  island: string;
  tagline: string;
  accentClass: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "ripple",
    name: "Ripple",
    subject: "ela",
    island: "Word Cove",
    tagline: "An otter who loves every story",
    accentClass: "accent-pink",
  },
  {
    id: "digits",
    name: "Digits",
    subject: "math",
    island: "Math Island",
    tagline: "A crab who counts every win",
    accentClass: "accent-green",
  },
  {
    id: "spark",
    name: "Spark",
    subject: "science",
    island: "Discovery Bay",
    tagline: "A jellyfish who asks why",
    accentClass: "accent-orange",
  },
];

const BY_SUBJECT = new Map(CHARACTERS.map((c) => [c.subject, c]));
const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

export function getCharacterBySubject(subject: Subject): Character {
  return BY_SUBJECT.get(subject) ?? CHARACTERS[0];
}

export function getCharacterById(id: CharacterId): Character {
  return BY_ID.get(id) ?? CHARACTERS[0];
}
