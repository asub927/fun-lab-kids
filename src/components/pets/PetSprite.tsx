import type { PetMood, PetSpeciesId } from "../../data/pets";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
};

function mouthPath(mood: PetMood, waiting: string, smile: string, neutral: string): string {
  if (mood === "waiting") return waiting;
  if (mood === "celebrating") return smile;
  return neutral;
}

function CelebrateFx() {
  return (
    <>
      <path d="M18 16l1.6 3.6 3.6 1-3.1 2.3.8 3.6-3.1-2.3-3.1 2.3.8-3.6-3.1-2.3 3.6-1z" fill="#d8a93b" />
      <path d="M58 12l1.3 3 3 .8-2.5 1.9.7 3-2.5-1.9-2.5 1.9.7-3-2.5-1.9 3-.8z" fill="#c73b7a" />
    </>
  );
}

function WorkingFx() {
  return (
    <path
      className="pet-part pet-part--sweat"
      d="M18 24c0 4 3 6 3 6s3-2 3-6-3-5-3-5-3 1-3 5z"
      fill="#7eb8c9"
      stroke="#0a0a0a"
      strokeWidth="1.2"
    />
  );
}

/** Articulated SVG pet with per-part CSS animation hooks. */
export function PetSprite({ speciesId, mood, facing = "right" }: PetSpriteProps) {
  const className = ["pet-sprite", `pet-sprite--${speciesId}`, `pet-sprite--${mood}`].join(" ");
  const wrapClass = ["pet-sprite-wrap", facing === "left" ? "pet-sprite-wrap--flip" : ""]
    .filter(Boolean)
    .join(" ");

  if (speciesId === "cat") {
    return (
      <span className={wrapClass}>
        <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
          <g className="pet-part pet-part--tail">
            <path
              d="M62 48c10 4 14 12 8 18"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g className="pet-part pet-part--body">
            <ellipse cx="40" cy="48" rx="20" ry="16" fill="#9b8f82" stroke="#0a0a0a" strokeWidth="3" />
          </g>
          <g className="pet-part pet-part--ear-l">
            <path d="M26 24l6 14-10-4z" fill="#9b8f82" stroke="#0a0a0a" strokeWidth="2.5" />
          </g>
          <g className="pet-part pet-part--ear-r">
            <path d="M54 24l-6 14 10-4z" fill="#9b8f82" stroke="#0a0a0a" strokeWidth="2.5" />
          </g>
          <g className="pet-part pet-part--eye pet-part--eye-l">
            <ellipse cx="33" cy="44" rx="2.8" ry="3.4" fill="#0a0a0a" />
            <circle cx="34" cy="43" r="0.9" fill="#fff" />
          </g>
          <g className="pet-part pet-part--eye pet-part--eye-r">
            <ellipse cx="47" cy="44" rx="2.8" ry="3.4" fill="#0a0a0a" />
            <circle cx="48" cy="43" r="0.9" fill="#fff" />
          </g>
          <path
            className="pet-part pet-part--mouth"
            d={mouthPath(mood, "M36 52h8", "M34 50c3 4 9 4 12 0", "M34 50c2 2 8 2 10 0")}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="pet-part pet-part--paw-r">
            <path d="M58 42c4-8 10-6 8 2" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="pet-part pet-part--leg-l">
            <path d="M30 60c-1 6 2 9 5 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g className="pet-part pet-part--leg-r">
            <path d="M50 60c1 6-2 9-5 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g className="pet-part pet-part--fx" aria-hidden="true">
            {mood === "celebrating" && <CelebrateFx />}
            {mood === "working" && <WorkingFx />}
          </g>
        </svg>
      </span>
    );
  }

  if (speciesId === "rabbit") {
    return (
      <span className={wrapClass}>
        <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
          <g className="pet-part pet-part--tail">
            <circle cx="58" cy="52" r="5" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="2.5" />
          </g>
          <g className="pet-part pet-part--body">
            <ellipse cx="40" cy="50" rx="18" ry="15" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="3" />
          </g>
          <g className="pet-part pet-part--ear-l">
            <ellipse cx="30" cy="22" rx="5" ry="14" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="2.5" />
          </g>
          <g className="pet-part pet-part--ear-r">
            <ellipse cx="50" cy="22" rx="5" ry="14" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="2.5" />
          </g>
          <g className="pet-part pet-part--eye pet-part--eye-l">
            <circle cx="34" cy="44" r="2.4" fill="#0a0a0a" />
            <circle cx="35" cy="43" r="0.8" fill="#fff" />
          </g>
          <g className="pet-part pet-part--eye pet-part--eye-r">
            <circle cx="46" cy="44" r="2.4" fill="#0a0a0a" />
            <circle cx="47" cy="43" r="0.8" fill="#fff" />
          </g>
          <path
            className="pet-part pet-part--mouth"
            d={mouthPath(mood, "M36 52h8", "M34 50c3 4 9 4 12 0", "M36 50c2 2 6 2 8 0")}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="pet-part pet-part--leg-l">
            <path d="M28 58c-4 8-2 14 4 12" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="pet-part pet-part--leg-r">
            <path d="M52 58c4 8 2 14-4 12" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="pet-part pet-part--paw-l">
            <ellipse cx="22" cy="62" rx="4" ry="3" fill="#f4efe0" stroke="#0a0a0a" strokeWidth="2" />
          </g>
          <g className="pet-part pet-part--fx" aria-hidden="true">
            {mood === "celebrating" && <CelebrateFx />}
            {mood === "working" && <WorkingFx />}
          </g>
        </svg>
      </span>
    );
  }

  // Dog (default)
  return (
    <span className={wrapClass}>
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
        <g className="pet-part pet-part--tail">
          <path
            d="M18 46c-8 2-12 10-6 14"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g className="pet-part pet-part--body">
          <ellipse cx="40" cy="48" rx="22" ry="15" fill="#c9962f" stroke="#0a0a0a" strokeWidth="3" />
        </g>
        <g className="pet-part pet-part--ear-l">
          <ellipse cx="26" cy="32" rx="7" ry="10" fill="#a67c28" stroke="#0a0a0a" strokeWidth="2.5" />
        </g>
        <g className="pet-part pet-part--ear-r">
          <ellipse cx="54" cy="32" rx="7" ry="10" fill="#a67c28" stroke="#0a0a0a" strokeWidth="2.5" />
        </g>
        <g className="pet-part pet-part--eye pet-part--eye-l">
          <circle cx="32" cy="44" r="2.8" fill="#0a0a0a" />
          <circle cx="33" cy="43" r="1" fill="#fff" />
        </g>
        <g className="pet-part pet-part--eye pet-part--eye-r">
          <circle cx="48" cy="44" r="2.8" fill="#0a0a0a" />
          <circle cx="49" cy="43" r="1" fill="#fff" />
        </g>
        <path
          className="pet-part pet-part--mouth"
          d={mouthPath(mood, "M34 52h12", "M32 50c4 5 12 5 16 0", "M32 50c3 3 13 3 16 0")}
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <g className="pet-part pet-part--paw-r">
          <ellipse cx="58" cy="50" rx="5" ry="4" fill="#c9962f" stroke="#0a0a0a" strokeWidth="2.5" />
        </g>
        <g className="pet-part pet-part--leg-l">
          <path d="M28 60c-1 6 2 9 5 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g className="pet-part pet-part--leg-r">
          <path d="M52 60c1 6-2 9-5 8" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g className="pet-part pet-part--fx" aria-hidden="true">
          {mood === "celebrating" && <CelebrateFx />}
          {mood === "working" && <WorkingFx />}
        </g>
      </svg>
    </span>
  );
}
