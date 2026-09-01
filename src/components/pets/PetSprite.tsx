import type { PetMood, PetSpeciesId } from "../../data/pets";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
};

/** Articulated SVG pet with per-part CSS animation hooks. */
export function PetSprite({ speciesId, mood, facing = "right" }: PetSpriteProps) {
  const className = ["pet-sprite", `pet-sprite--${speciesId}`, `pet-sprite--${mood}`].join(" ");
  const wrapClass = ["pet-sprite-wrap", facing === "left" ? "pet-sprite-wrap--flip" : ""]
    .filter(Boolean)
    .join(" ");

  if (speciesId === "coral") {
    return (
      <span className={wrapClass}>
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
        <g className="pet-part pet-part--body">
          <ellipse cx="40" cy="44" rx="22" ry="14" fill="#c73b7a" stroke="#0a0a0a" strokeWidth="3" />
          <circle cx="30" cy="46" r="3.5" fill="#f4efe0" />
        </g>
        <g className="pet-part pet-part--tail">
          <path d="M18 44c-8-5-10-12-5-16 5 3 9 8 12 14" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
        </g>
        <g className="pet-part pet-part--face">
          <g className="pet-part pet-part--eye">
            <circle cx="50" cy="40" r="3.2" fill="#0a0a0a" />
            <circle cx="51.2" cy="38.8" r="1.1" fill="#fff" />
          </g>
          <path
            className="pet-part pet-part--mouth"
            d={
              mood === "waiting"
                ? "M48 48h8"
                : mood === "celebrating"
                  ? "M47 47c2 3 7 3 9 0"
                  : "M48 47c2 2 6 2 8 0"
            }
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g className="pet-part pet-part--fin">
          <path d="M58 44h12" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g className="pet-part pet-part--fx" aria-hidden="true">
          {mood === "celebrating" && (
            <>
              <path d="M24 18l1.5 3.5 3.5 1-3 2.2.8 3.5-3-2.2-3 2.2.8-3.5-3-2.2 3.5-1z" fill="#d8a93b" />
              <path d="M56 14l1.2 2.8 2.8.8-2.4 1.8.6 2.8-2.4-1.8-2.4 1.8.6-2.8-2.4-1.8 2.8-.8z" fill="#ee7a2e" />
            </>
          )}
          {mood === "working" && (
            <>
              <circle className="pet-part pet-part--bubble" cx="18" cy="28" r="2.2" fill="#7eb8c9" />
              <circle className="pet-part pet-part--bubble" cx="12" cy="22" r="1.5" fill="#7eb8c9" />
            </>
          )}
        </g>
      </svg>
      </span>
    );
  }

  if (speciesId === "sprout") {
    return (
      <span className={wrapClass}>
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
        <g className="pet-part pet-part--shell">
          <ellipse cx="40" cy="52" rx="24" ry="15" fill="#2d7e73" stroke="#0a0a0a" strokeWidth="3" />
        </g>
        <g className="pet-part pet-part--body">
          <circle cx="40" cy="34" r="14" fill="#3f9a88" stroke="#0a0a0a" strokeWidth="3" />
        </g>
        <g className="pet-part pet-part--face">
          <circle className="pet-part pet-part--eye pet-part--eye-l" cx="35" cy="32" r="2.4" fill="#0a0a0a" />
          <circle className="pet-part pet-part--eye pet-part--eye-r" cx="45" cy="32" r="2.4" fill="#0a0a0a" />
          <path
            className="pet-part pet-part--mouth"
            d={mood === "waiting" ? "M36 40h8" : "M36 38c2 2 6 2 8 0"}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g className="pet-part pet-part--leaf">
          <path d="M40 20c0-7 7-11 11-8-3 4-5 7-11 8z" fill="#6f7a2e" stroke="#0a0a0a" strokeWidth="2" />
        </g>
        <g className="pet-part pet-part--leg pet-part--leg-l">
          <path d="M24 58c-3 4-2 8 1 8" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="pet-part pet-part--leg pet-part--leg-r">
          <path d="M56 58c3 4 2 8-1 8" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="pet-part pet-part--fx" aria-hidden="true">
          {mood === "celebrating" && (
            <path d="M22 14l1.5 3.5 3.5 1-3 2.2.8 3.5-3-2.2-3 2.2.8-3.5-3-2.2 3.5-1z" fill="#d8a93b" />
          )}
        </g>
      </svg>
      </span>
    );
  }

  return (
    <span className={wrapClass}>
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <g className="pet-part pet-part--body">
        <ellipse cx="40" cy="48" rx="22" ry="15" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="3" />
      </g>
      <g className="pet-part pet-part--eye pet-part--eye-l">
        <circle cx="28" cy="30" r="5.5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="28" cy="30" r="2.2" fill="#0a0a0a" />
        <circle cx="29.2" cy="28.8" r="0.9" fill="#fff" />
      </g>
      <g className="pet-part pet-part--eye pet-part--eye-r">
        <circle cx="52" cy="30" r="5.5" fill="#ee7a2e" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="52" cy="30" r="2.2" fill="#0a0a0a" />
        <circle cx="53.2" cy="28.8" r="0.9" fill="#fff" />
      </g>
      <g className="pet-part pet-part--mouth">
        <path
          d={
            mood === "waiting"
              ? "M34 52h12"
              : mood === "celebrating"
                ? "M32 50c4 5 12 5 16 0"
                : "M32 50c3 3 13 3 16 0"
          }
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
      <g className="pet-part pet-part--claw pet-part--claw-l">
        <path
          d="M16 50c-6 1-10 -1-11 -5 4 0 8 1 12 4"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M16 46c-5 -4-8 -9-5 -12 2 3 5 7 8 10"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
      <g className="pet-part pet-part--claw pet-part--claw-r">
        <path
          d="M64 50c6 1 10 -1 11 -5 -4 0-8 1-12 4"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M64 46c5 -4 8 -9 5 -12 -2 3-5 7-8 10"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
      <g className="pet-part pet-part--leg pet-part--leg-l">
        <path d="M26 60c-2 5 0 8 3 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M34 62c-1 5 1 7 3 7" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="pet-part pet-part--leg pet-part--leg-r">
        <path d="M54 60c2 5 0 8-3 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M46 62c1 5 -1 7-3 7" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="pet-part pet-part--fx" aria-hidden="true">
        {mood === "celebrating" && (
          <>
            <path d="M18 16l1.6 3.6 3.6 1-3.1 2.3.8 3.6-3.1-2.3-3.1 2.3.8-3.6-3.1-2.3 3.6-1z" fill="#d8a93b" />
            <path d="M58 12l1.3 3 3 .8-2.5 1.9.7 3-2.5-1.9-2.5 1.9.7-3-2.5-1.9 3-.8z" fill="#c73b7a" />
          </>
        )}
        {mood === "working" && (
          <path
            className="pet-part pet-part--sweat"
            d="M18 24c0 4 3 6 3 6s3-2 3-6-3-5-3-5-3 1-3 5z"
            fill="#7eb8c9"
            stroke="#0a0a0a"
            strokeWidth="1.2"
          />
        )}
      </g>
    </svg>
    </span>
  );
}
