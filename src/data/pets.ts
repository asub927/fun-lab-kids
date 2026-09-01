export type PetSpeciesId = "pebble" | "coral" | "sprout";
export type PetStage = "egg" | "hatchling" | "buddy" | "champion";
export type PetMood = "idle" | "working" | "celebrating" | "hungry" | "sleepy";

export type PetSpecies = {
  id: PetSpeciesId;
  name: string;
  tagline: string;
  accentClass: string;
};

export const PET_SPECIES: PetSpecies[] = [
  {
    id: "pebble",
    name: "Pebble",
    tagline: "A cozy crab who clicks along when you solve",
    accentClass: "accent-green",
  },
  {
    id: "coral",
    name: "Coral",
    tagline: "A bright fish who swirls for every streak",
    accentClass: "accent-pink",
  },
  {
    id: "sprout",
    name: "Sprout",
    tagline: "A gentle turtle who grows with every skill",
    accentClass: "accent-orange",
  },
];

const BY_ID = new Map(PET_SPECIES.map((pet) => [pet.id, pet]));

export function getPetSpecies(id: PetSpeciesId): PetSpecies {
  return BY_ID.get(id) ?? PET_SPECIES[0];
}

export function stageFromChecks(lifetimeChecks: number): PetStage {
  if (lifetimeChecks < 1) return "egg";
  if (lifetimeChecks < 20) return "hatchling";
  if (lifetimeChecks < 50) return "buddy";
  return "champion";
}

export function stageLabel(stage: PetStage): string {
  switch (stage) {
    case "egg":
      return "Egg";
    case "hatchling":
      return "Hatchling";
    case "buddy":
      return "Buddy";
    case "champion":
      return "Champion";
  }
}

export function checksToNextStage(lifetimeChecks: number): {
  next: PetStage | null;
  remaining: number;
} {
  if (lifetimeChecks < 1) return { next: "hatchling", remaining: 1 };
  if (lifetimeChecks < 20) return { next: "buddy", remaining: 20 - lifetimeChecks };
  if (lifetimeChecks < 50) return { next: "champion", remaining: 50 - lifetimeChecks };
  return { next: null, remaining: 0 };
}
