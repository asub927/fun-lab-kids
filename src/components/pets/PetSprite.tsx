import type { PetMood, PetSpeciesId } from "../../data/pets";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
};

export function PetSprite({ speciesId, mood, facing = "right" }: PetSpriteProps) {
  const className = [
    "pet-sprite",
    `pet-sprite--${speciesId}`,
    `pet-sprite--${mood}`,
    facing === "left" ? "pet-sprite--flip" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (speciesId === "coral") {
    return (
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
        <ellipse cx="42" cy="42" rx="22" ry="14" fill="#c73b7a" stroke="#0a0a0a" strokeWidth="3" />
        <path d="M20 42c-6-4-8-10-4-14 4 2 8 6 10 12" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="52" cy="38" r="3" fill="#0a0a0a" />
        <circle cx="53" cy="37" r="1" fill="#fff" />
        <path d="M58 42h10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="34" cy="44" r="3" fill="#f4efe0" />
        {mood === "celebrating" && (
          <path d="M40 18l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.2" />
        )}
        {mood === "waving" && (
          <path d="M62 28c6-8 12-6 10 2" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (speciesId === "sprout") {
    return (
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
        <ellipse cx="40" cy="50" rx="24" ry="16" fill="#2d7e73" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="40" cy="34" r="14" fill="#3f9a88" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="35" cy="32" r="2.5" fill="#0a0a0a" />
        <circle cx="45" cy="32" r="2.5" fill="#0a0a0a" />
        <path
          d={mood === "waiting" ? "M36 39c2 0 6 0 8 0" : "M36 38c2 2 6 2 8 0"}
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M40 20c0-6 6-10 10-8-2 4-4 6-10 8z" fill="#6f7a2e" stroke="#0a0a0a" strokeWidth="2" />
        {mood === "celebrating" && (
          <path d="M28 16l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.2" />
        )}
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="40" cy="46" rx="22" ry="16" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="3" />
      <circle cx="28" cy="28" r="5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="52" cy="28" r="5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
      <line x1="28" y1="33" x2="32" y2="40" stroke="#0a0a0a" strokeWidth="2" />
      <line x1="52" y1="33" x2="48" y2="40" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="28" cy="28" r="2" fill="#0a0a0a" />
      <circle cx="52" cy="28" r="2" fill="#0a0a0a" />
      <path
        d={mood === "waiting" ? "M34 50h12" : "M32 48c3 3 13 3 16 0"}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M18 50c-4 2-8 2-10 0" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
      <path
        d={mood === "waving" ? "M62 42c6-10 12-8 10 2" : "M62 50c4 2 8 2 10 0"}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {mood === "celebrating" && (
        <path d="M40 12l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#d8a93b" stroke="#0a0a0a" strokeWidth="1.2" />
      )}
    </svg>
  );
}
