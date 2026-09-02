import { getPetSpecies, type PetMood, type PetSpeciesId } from "../../data/pets";
import { CodexPetSprite } from "./CodexPetSprite";
import { SvgPetSprite } from "./SvgPetSprite";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
  patrolling?: boolean;
  /** Larger scale for picker previews. */
  preview?: boolean;
};

/** Lab buddy renderer — Codex spritesheet when available, otherwise inline SVG. */
export function PetSprite({
  speciesId,
  mood,
  facing = "right",
  patrolling = false,
  preview = false,
}: PetSpriteProps) {
  const species = getPetSpecies(speciesId);

  if (species.codexPackageId) {
    return (
      <span className={["pet-sprite-wrap", preview ? "pet-sprite-wrap--preview" : ""].filter(Boolean).join(" ")}>
        <CodexPetSprite
          packageId={species.codexPackageId}
          mood={mood}
          facing={facing}
          patrolling={patrolling}
          scale={preview ? 0.42 : 0.34}
          className="pet-sprite"
        />
      </span>
    );
  }

  return <SvgPetSprite speciesId={speciesId} mood={mood} facing={facing} />;
}
