#!/usr/bin/env bash
# Generates pre-recorded celebration voice clips for each lab buddy species.
# Uses Microsoft Edge neural TTS (edge-tts) — run after changing petDialogue lines.
set -euo pipefail

EDGE_TTS="${EDGE_TTS:-$HOME/.local/bin/edge-tts}"
OUT_ROOT="public/pets/voice"

declare -A VOICES=(
  [dog]="en-US-AnaNeural"
  [cat]="en-US-JennyNeural"
  [rabbit]="en-US-EmmaNeural"
)

declare -A RATES=(
  [dog]="+12%"
  [cat]="+4%"
  [rabbit]="+16%"
)

declare -A PITCHES=(
  [dog]="+2Hz"
  [cat]="+0Hz"
  [rabbit]="+4Hz"
)

generate() {
  local species="$1"
  local context="$2"
  local slot="$3"
  local text="$4"
  local dir="$OUT_ROOT/$species"
  local tmp="$dir/${context}-${slot}.webm"
  local out="$dir/${context}-${slot}.mp3"

  mkdir -p "$dir"
  "$EDGE_TTS" \
    --voice "${VOICES[$species]}" \
    --rate "${RATES[$species]}" \
    --pitch "${PITCHES[$species]}" \
    --text "$text" \
    --write-media "$tmp"

  ffmpeg -y -loglevel error -i "$tmp" -codec:a libmp3lame -qscale:a 4 "$out"
  rm -f "$tmp"
  echo "  $out"
}

echo "Generating pet celebration voice clips..."

# dog
generate dog correct 01 "Yes! Good job!"
generate dog correct 02 "Woof! You got it!"
generate dog correct 03 "That's the one! Nice work!"
generate dog correct 04 "Tail wag! You nailed it!"
generate dog mastery 01 "Skill mastered! Woof woof!"
generate dog mastery 02 "You did it! I'm so proud!"
generate dog achievement 01 "New badge! Woof!"
generate dog achievement 02 "Look at you go!"

# cat (Om Nom)
generate cat correct 01 "Purrrfect!"
generate cat correct 02 "Meow! That's right!"
generate cat correct 03 "Nice one, friend!"
generate cat correct 04 "You got it! Yum!"
generate cat mastery 01 "Mastered! Meow!"
generate cat mastery 02 "Amazing work!"
generate cat achievement 01 "A new badge! Meow!"
generate cat achievement 02 "So sweet!"

# rabbit (Hopper)
generate rabbit correct 01 "Hop hop hooray!"
generate rabbit correct 02 "You got it! Bounce!"
generate rabbit correct 03 "Woo hoo! Nice one!"
generate rabbit correct 04 "That's right! Hop hop!"
generate rabbit mastery 01 "Skill mastered! Hop hop!"
generate rabbit mastery 02 "Big win! So bouncy!"
generate rabbit achievement 01 "Badge unlocked! Hop!"
generate rabbit achievement 02 "You did it! Yay!"

echo "Done — $(find "$OUT_ROOT" -name '*.mp3' | wc -l | tr -d ' ') clips in $OUT_ROOT"
