import type { CharacterMood } from "../data/characters";
import { getCharacterBySubject } from "../data/characters";
import type { Subject } from "../types";
import { Digits, Ripple, Spark } from "./characters";

type CharacterAvatarProps = {
  subject: Subject;
  mood?: CharacterMood;
  size?: "default" | "compact";
};

const AVATAR_COMPONENTS = {
  ripple: Ripple,
  digits: Digits,
  spark: Spark,
} as const;

export function CharacterAvatar({ subject, mood = "idle", size = "default" }: CharacterAvatarProps) {
  const character = getCharacterBySubject(subject);
  const Svg = AVATAR_COMPONENTS[character.id];
  const sizeClass = size === "compact" ? "character-avatar--compact" : "";

  return (
    <div
      className={`character-avatar ${character.accentClass} character-avatar--${mood} ${sizeClass}`}
      aria-hidden="true"
    >
      <Svg className="character-avatar-svg" />
    </div>
  );
}
