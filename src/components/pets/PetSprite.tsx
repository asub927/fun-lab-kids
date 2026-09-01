import type { PetMood, PetSpeciesId, PetStage } from "../../data/pets";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  stage: PetStage;
  mood: PetMood;
};

export function PetSprite({ speciesId, stage, mood }: PetSpriteProps) {
  if (stage === "egg") {
    return (
      <svg className={`pet-sprite pet-sprite--egg pet-sprite--${mood}`} viewBox="0 0 80 80" aria-hidden="true">
        <ellipse cx="40" cy="44" rx="18" ry="24" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="3" />
        <ellipse cx="40" cy="38" rx="10" ry="8" fill="#fff7e6" opacity="0.7" />
        <path d="M28 48c4 3 8 4 12 4s8-1 12-4" fill="none" stroke="#d8a93b" strokeWidth="2" />
      </svg>
    );
  }

  if (speciesId === "coral") {
    return (
      <svg className={`pet-sprite pet-sprite--coral pet-sprite--${mood}`} viewBox="0 0 80 80" aria-hidden="true">
        <ellipse cx="42" cy="42" rx="22" ry="14" fill="#c73b7a" stroke="#0a0a0a" strokeWidth="3" />
        <path d="M20 42c-6-4-8-10-4-14 4 2 8 6 10 12" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="52" cy="38" r="3" fill="#0a0a0a" />
        <circle cx="53" cy="37" r="1" fill="#fff" />
        <path d="M58 42h10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
        {stage !== "hatchling" && <circle cx="34" cy="44" r="3" fill="#f4efe0" />}
        {stage === "champion" && (
          <path d="M40 24l3 6 7 1-5 4 2 7-7-4-7 4 2-7-5-4 7-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.5" />
        )}
      </svg>
    );
  }

  if (speciesId === "sprout") {
    return (
      <svg className={`pet-sprite pet-sprite--sprout pet-sprite--${mood}`} viewBox="0 0 80 80" aria-hidden="true">
        <ellipse cx="40" cy="50" rx="24" ry="16" fill="#2d7e73" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="40" cy="34" r="14" fill="#3f9a88" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="35" cy="32" r="2.5" fill="#0a0a0a" />
        <circle cx="45" cy="32" r="2.5" fill="#0a0a0a" />
        <path d="M36 38c2 2 6 2 8 0" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 20c0-6 6-10 10-8-2 4-4 6-10 8z" fill="#6f7a2e" stroke="#0a0a0a" strokeWidth="2" />
        {stage === "champion" && (
          <path d="M28 22l3 6 7 1-5 4 2 7-7-4-7 4 2-7-5-4 7-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.5" />
        )}
      </svg>
    );
  }

  return (
    <svg className={`pet-sprite pet-sprite--pebble pet-sprite--${mood}`} viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="40" cy="46" rx="22" ry="16" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="3" />
      <circle cx="28" cy="28" r="5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="52" cy="28" r="5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
      <line x1="28" y1="33" x2="32" y2="40" stroke="#0a0a0a" strokeWidth="2" />
      <line x1="52" y1="33" x2="48" y2="40" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="28" cy="28" r="2" fill="#0a0a0a" />
      <circle cx="52" cy="28" r="2" fill="#0a0a0a" />
      <path d="M32 48c3 3 13 3 16 0" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 50c-4 2-8 2-10 0" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 50c4 2 8 2 10 0" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
      {stage === "champion" && (
        <path d="M40 14l3 6 7 1-5 4 2 7-7-4-7 4 2-7-5-4 7-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.5" />
      )}
    </svg>
  );
}
