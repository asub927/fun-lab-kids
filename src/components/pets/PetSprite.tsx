import { type PetMood, type PetSpeciesId } from "../../data/pets";
import { SvgPetSprite } from "./SvgPetSprite";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
  patrolling?: boolean;
  /** Larger scale for picker previews. */
  preview?: boolean;
};

/** Lab buddy renderer — original SVG sprites (no third-party Codex packs). */
export function PetSprite({
  speciesId,
  mood,
  facing = "right",
  patrolling = false,
  preview = false,
}: PetSpriteProps) {
  void patrolling;
  void preview;
  return <SvgPetSprite speciesId={speciesId} mood={mood} facing={facing} />;
}
