import type { CharacterMood } from "../data/characters";
import { getCharacterBySubject } from "../data/characters";
import type { Subject } from "../types";
import { CharacterAvatar } from "./CharacterAvatar";
import { CharacterSpeech } from "./CharacterSpeech";

type CharacterGuideProps = {
  subject: Subject;
  line: string;
  mood?: CharacterMood;
  compact?: boolean;
  featured?: boolean;
  live?: boolean;
};

export function CharacterGuide({
  subject,
  line,
  mood = "idle",
  compact = false,
  featured = false,
  live = false,
}: CharacterGuideProps) {
  const character = getCharacterBySubject(subject);

  return (
    <div
      className={`character-guide ${compact ? "character-guide--compact" : ""} ${featured ? "character-guide--featured" : ""} ${character.accentClass}`}
    >
      <CharacterAvatar subject={subject} mood={mood} size={compact ? "compact" : "default"} />
      <div className="character-guide-content">
        <p className="character-guide-name">{character.name}</p>
        <CharacterSpeech text={line} compact={compact} live={live} />
      </div>
    </div>
  );
}
