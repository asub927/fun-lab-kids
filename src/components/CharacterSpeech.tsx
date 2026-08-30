type CharacterSpeechProps = {
  text: string;
  compact?: boolean;
  live?: boolean;
};

export function CharacterSpeech({ text, compact = false, live = false }: CharacterSpeechProps) {
  return (
    <div
      className={`character-speech ${compact ? "character-speech--compact" : ""}`}
      {...(live ? { "aria-live": "polite" as const } : {})}
    >
      <p key={text} className="character-speech-line">
        {text}
      </p>
    </div>
  );
}
