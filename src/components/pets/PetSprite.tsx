import type { ReactNode } from "react";
import type { PetMood, PetSpeciesId } from "../../data/pets";

type PetSpriteProps = {
  speciesId: PetSpeciesId;
  mood: PetMood;
  facing?: "left" | "right";
};

const INK = "#0a0a0a";

function mouthPath(mood: PetMood, waiting: string, smile: string, neutral: string): string {
  if (mood === "waiting") return waiting;
  if (mood === "celebrating") return smile;
  return neutral;
}

function Eye({ cx, cy, r = 2.6, className }: { cx: number; cy: number; r?: number; className: string }) {
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r + 0.4} fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill={INK} />
      <circle cx={cx + 0.7} cy={cy - 0.7} r={r * 0.28} fill="#fff" />
    </g>
  );
}

function CelebrateFx() {
  return (
    <>
      <path
        d="M14 14l1.8 4 4 1.1-3.4 2.5.9 4-3.4-2.5-3.4 2.5.9-4-3.4-2.5 4-1.1z"
        fill="#d8a93b"
        stroke={INK}
        strokeWidth="0.8"
      />
      <path
        d="M62 10l1.5 3.4 3.4.9-2.8 2.1.8 3.4-2.8-2.1-2.8 2.1.8-3.4-2.8-2.1 3.4-.9z"
        fill="#c73b7a"
        stroke={INK}
        strokeWidth="0.8"
      />
      <circle cx="68" cy="22" r="2.2" fill="#ee7a2e" stroke={INK} strokeWidth="0.8" />
      <circle cx="10" cy="28" r="1.8" fill="#2d7e73" stroke={INK} strokeWidth="0.8" />
    </>
  );
}

function WorkingFx() {
  return (
    <path
      className="pet-part pet-part--sweat"
      d="M16 22c0 4.5 3.2 7 3.2 7s3.2-2.5 3.2-7-3.2-5.5-3.2-5.5-3.2 1-3.2 5.5z"
      fill="#9ed4e4"
      stroke={INK}
      strokeWidth="1.2"
    />
  );
}

function SpriteWrap({
  className,
  wrapClass,
  children,
}: {
  className: string;
  wrapClass: string;
  children: ReactNode;
}) {
  return (
    <span className={wrapClass}>
      <svg className={className} viewBox="0 0 80 80" aria-hidden="true" shapeRendering="crispEdges">
        {children}
      </svg>
    </span>
  );
}

/** Pixel-inspired SVG pets with per-part CSS animation hooks. */
export function PetSprite({ speciesId, mood, facing = "right" }: PetSpriteProps) {
  const className = ["pet-sprite", `pet-sprite--${speciesId}`, `pet-sprite--${mood}`].join(" ");
  const wrapClass = ["pet-sprite-wrap", facing === "left" ? "pet-sprite-wrap--flip" : ""]
    .filter(Boolean)
    .join(" ");

  if (speciesId === "cat") {
    return (
      <SpriteWrap className={className} wrapClass={wrapClass}>
        <g className="pet-part pet-part--tail">
          <path
            d="M60 46c8 2 14 8 12 16-2 6-8 8-12 4"
            fill="#9a8e80"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M64 50c3 2 5 5 4 9" fill="none" stroke="#7a6e62" strokeWidth="2" strokeLinecap="round" />
          <path d="M66 54c2 2 3 4 2 7" fill="none" stroke="#7a6e62" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        <g className="pet-part pet-part--body">
          <ellipse cx="40" cy="50" rx="19" ry="15" fill="#b0a498" stroke={INK} strokeWidth="2.6" />
          <ellipse cx="40" cy="52" rx="13" ry="9" fill="#d8cfc4" />
          <path d="M30 44c4-6 16-6 20 0" fill="none" stroke="#8a7e72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M34 48c3-3 9-3 12 0" fill="none" stroke="#8a7e72" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        <g className="pet-part pet-part--leg-l">
          <path d="M30 60c-1 7 2 10 6 9" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="34" cy="68" rx="4.5" ry="2.8" fill="#b0a498" stroke={INK} strokeWidth="1.8" />
        </g>
        <g className="pet-part pet-part--leg-r">
          <path d="M50 60c1 7-2 10-6 9" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="46" cy="68" rx="4.5" ry="2.8" fill="#b0a498" stroke={INK} strokeWidth="1.8" />
        </g>

        <g className="pet-part pet-part--ear-l">
          <path d="M24 28l8 16-12-5z" fill="#b0a498" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M27 32l4 9-6-2z" fill="#f0a8b0" />
        </g>
        <g className="pet-part pet-part--ear-r">
          <path d="M56 28l-8 16 12-5z" fill="#b0a498" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M53 32l-4 9 6-2z" fill="#f0a8b0" />
        </g>

        <ellipse cx="40" cy="42" rx="17" ry="14" fill="#b0a498" stroke={INK} strokeWidth="2.6" />
        <path d="M28 38c2-4 8-5 12-3" fill="none" stroke="#8a7e72" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M52 38c-2-4-8-5-12-3" fill="none" stroke="#8a7e72" strokeWidth="1.8" strokeLinecap="round" />

        <Eye cx={33} cy={41} className="pet-part pet-part--eye pet-part--eye-l" />
        <Eye cx={47} cy={41} className="pet-part pet-part--eye pet-part--eye-r" />
        <ellipse cx={33} cy={41} rx="1.2" ry="2.4" fill="#6faa3a" opacity="0.55" />
        <ellipse cx={47} cy={41} rx="1.2" ry="2.4" fill="#6faa3a" opacity="0.55" />

        <ellipse cx="40" cy="47.5" rx="2.2" ry="1.6" fill="#f0a8b0" stroke={INK} strokeWidth="1.2" />
        <path
          className="pet-part pet-part--mouth"
          d={mouthPath(mood, "M36 52h8", "M34 49c3 5 9 5 12 0", "M36 50c2 2 6 2 8 0")}
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path d="M22 46h6" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 49h7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M58 46h-6" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M58 49h-7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />

        <g className="pet-part pet-part--paw-r">
          <ellipse cx="58" cy="44" rx="5" ry="4" fill="#b0a498" stroke={INK} strokeWidth="2" />
          <path d="M55 42v4M58 41.5v4.5M61 42v4" stroke={INK} strokeWidth="1" strokeLinecap="round" />
        </g>

        {mood === "celebrating" && (
          <ellipse cx="28" cy="48" rx="2.2" ry="1.4" fill="#f0a8b0" opacity="0.7" />
        )}

        <g className="pet-part pet-part--fx" aria-hidden="true">
          {mood === "celebrating" && <CelebrateFx />}
          {mood === "working" && <WorkingFx />}
        </g>
      </SpriteWrap>
    );
  }

  if (speciesId === "rabbit") {
    return (
      <SpriteWrap className={className} wrapClass={wrapClass}>
        <g className="pet-part pet-part--tail">
          <circle cx="58" cy="50" r="5.5" fill="#fff8ee" stroke={INK} strokeWidth="2.2" />
          <circle cx="58" cy="50" r="3" fill="#f0e6d8" />
        </g>

        <g className="pet-part pet-part--body">
          <ellipse cx="40" cy="52" rx="17" ry="14" fill="#fff8ee" stroke={INK} strokeWidth="2.6" />
          <ellipse cx="40" cy="54" rx="11" ry="8" fill="#f5ebe0" />
        </g>

        <g className="pet-part pet-part--leg-l">
          <path d="M28 58c-5 9-2 16 5 14" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="24" cy="70" rx="6" ry="3.2" fill="#fff8ee" stroke={INK} strokeWidth="2" />
        </g>
        <g className="pet-part pet-part--leg-r">
          <path d="M52 58c5 9 2 16-5 14" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="56" cy="70" rx="6" ry="3.2" fill="#fff8ee" stroke={INK} strokeWidth="2" />
        </g>

        <g className="pet-part pet-part--ear-l">
          <ellipse cx="30" cy="18" rx="5.5" ry="15" fill="#fff8ee" stroke={INK} strokeWidth="2.4" />
          <ellipse cx="30" cy="18" rx="3" ry="10" fill="#ffc8d8" />
        </g>
        <g className="pet-part pet-part--ear-r">
          <ellipse cx="50" cy="18" rx="5.5" ry="15" fill="#fff8ee" stroke={INK} strokeWidth="2.4" />
          <ellipse cx="50" cy="18" rx="3" ry="10" fill="#ffc8d8" />
        </g>

        <ellipse cx="40" cy="44" rx="15" ry="12" fill="#fff8ee" stroke={INK} strokeWidth="2.6" />

        <Eye cx={34} cy={43} r={2.4} className="pet-part pet-part--eye pet-part--eye-l" />
        <Eye cx={46} cy={43} r={2.4} className="pet-part pet-part--eye pet-part--eye-r" />

        <ellipse cx="40" cy="48.5" rx="2" ry="1.5" fill="#ffb8c8" stroke={INK} strokeWidth="1.2" />
        <path
          className="pet-part pet-part--mouth"
          d={mouthPath(mood, "M36 52h8", "M34 49c3 5 9 5 12 0", "M37 50c1.5 1.5 4.5 1.5 6 0")}
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <g className="pet-part pet-part--paw-l">
          <ellipse cx="22" cy="58" rx="4.5" ry="3.5" fill="#fff8ee" stroke={INK} strokeWidth="2" />
          <path d="M20 57v3M22.5 56.5v3.5M25 57v3" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
        </g>

        {mood === "celebrating" && (
          <>
            <ellipse cx="30" cy="49" rx="2" ry="1.3" fill="#ffc8d8" opacity="0.75" />
            <ellipse cx="50" cy="49" rx="2" ry="1.3" fill="#ffc8d8" opacity="0.75" />
          </>
        )}

        <g className="pet-part pet-part--fx" aria-hidden="true">
          {mood === "celebrating" && <CelebrateFx />}
          {mood === "working" && <WorkingFx />}
        </g>
      </SpriteWrap>
    );
  }

  // Buddy — golden retriever pup
  return (
    <SpriteWrap className={className} wrapClass={wrapClass}>
      <g className="pet-part pet-part--tail">
        <path
          d="M16 44c-10 2-14 12-6 18 4 3 8 1 10-4"
          fill="#c89028"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M12 50c-2 4-1 8 2 10" fill="none" stroke="#a07020" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="pet-part pet-part--body">
        <ellipse cx="40" cy="50" rx="21" ry="15" fill="#dba832" stroke={INK} strokeWidth="2.6" />
        <ellipse cx="40" cy="52" rx="14" ry="9" fill="#fce8b0" />
        <path d="M28 44c5-4 19-4 24 0" fill="none" stroke="#c07820" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="pet-part pet-part--leg-l">
        <path d="M28 60c-1 7 2 10 6 9" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="32" cy="68" rx="5" ry="3" fill="#dba832" stroke={INK} strokeWidth="1.8" />
        <path d="M29 67h6" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      </g>
      <g className="pet-part pet-part--leg-r">
        <path d="M52 60c1 7-2 10-6 9" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="48" cy="68" rx="5" ry="3" fill="#dba832" stroke={INK} strokeWidth="1.8" />
        <path d="M45 67h6" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      </g>

      <g className="pet-part pet-part--ear-l">
        <ellipse cx="24" cy="34" rx="8" ry="11" fill="#a07020" stroke={INK} strokeWidth="2.2" />
        <ellipse cx="25" cy="36" rx="4.5" ry="6" fill="#f0c870" />
      </g>
      <g className="pet-part pet-part--ear-r">
        <ellipse cx="56" cy="34" rx="8" ry="11" fill="#a07020" stroke={INK} strokeWidth="2.2" />
        <ellipse cx="55" cy="36" rx="4.5" ry="6" fill="#f0c870" />
      </g>

      <ellipse cx="40" cy="42" rx="18" ry="15" fill="#dba832" stroke={INK} strokeWidth="2.6" />
      <ellipse cx="40" cy="44" rx="12" ry="9" fill="#f5d878" />

      <ellipse cx="40" cy="47" rx="9" ry="7" fill="#fce8b0" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3d2810" />

      <Eye cx={32} cy={39} className="pet-part pet-part--eye pet-part--eye-l" />
      <Eye cx={48} cy={39} className="pet-part pet-part--eye pet-part--eye-r" />

      <path
        d="M26 42c3-2 8-2 11 0"
        fill="none"
        stroke="#c07820"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M54 42c-3-2-8-2-11 0"
        fill="none"
        stroke="#c07820"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        className="pet-part pet-part--mouth"
        d={mouthPath(mood, "M34 52h12", "M32 49c4 6 16 6 20 0", "M34 51c3 2 9 2 12 0")}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {mood === "celebrating" && (
        <ellipse cx="40" cy="53" rx="3.5" ry="2.5" fill="#e87070" stroke={INK} strokeWidth="1.2" />
      )}

      <rect x="28" y="54" width="24" height="5" rx="2" fill="#c73b7a" stroke={INK} strokeWidth="1.6" />
      <circle cx="40" cy="56.5" r="2.2" fill="#d8a93b" stroke={INK} strokeWidth="1.2" />

      <g className="pet-part pet-part--paw-r">
        <ellipse cx="58" cy="46" rx="5.5" ry="4.5" fill="#dba832" stroke={INK} strokeWidth="2" />
        <path d="M55 44.5v4M58 44v4.5M61 44.5v4" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      </g>

      <g className="pet-part pet-part--fx" aria-hidden="true">
        {mood === "celebrating" && <CelebrateFx />}
        {mood === "working" && <WorkingFx />}
      </g>
    </SpriteWrap>
  );
}
