import type { ActivityParams } from "../activities";
import { difficultyForSeed } from "./math";
import { elaQuestionSets } from "../questionSets/elaContent";

const NAMES = ["Sam", "Lila", "Ben", "Mia", "Noah", "Emma", "Kai", "Zoe", "Tyler", "Nora", "Omar", "Jade"];
const PLACES = ["park", "school", "library", "garden", "playground", "kitchen", "beach", "farm"];
const ANIMALS = ["mouse", "lion", "goat", "farmer", "bird", "fox", "bear", "wolf", "deer", "owl"];

const WRITING_PROMPTS = [
  "Write about your favorite animal and one fact about it.",
  "Write about a place you like to visit and why.",
  "Write about something you learned at school this week.",
  "Write about a friend and what you like to do together.",
  "Write about a weather day and what you wore.",
  "Write about a book character you enjoy.",
  "Write about a family tradition.",
  "Write about a goal you have for this year.",
  "Write about a tool you use to learn.",
  "Write about something that makes you feel proud.",
];

const READING_LEADS = [
  "First,",
  "Next,",
  "Then,",
  "Also,",
  "Later,",
  "Soon,",
  "After that,",
  "One day,",
  "At last,",
  "Meanwhile,",
];

const LANGUAGE_TAGS = ["today", "quickly", "outside", "again", "now", "here", "too", "also", "very", "well"];

const CHECKLIST_ITEMS = [
  ["Read the title", "Look at pictures", "Ask one question"],
  ["Find the main idea", "Check bold words", "Summarize in one sentence"],
  ["Listen to the speaker", "Take a turn talking", "Use a complete sentence"],
  ["Say the word slowly", "Stretch each sound", "Write the letters"],
  ["Read smoothly", "Pause at punctuation", "Use expression"],
  ["Share one fact", "Use a topic sentence", "Add a closing sentence"],
  ["Name the topic", "Give two reasons", "Use because"],
  ["Check capitals", "Check ending marks", "Reread aloud"],
  ["Use polite words", "Wait for your turn", "Look at the speaker"],
  ["Pick a vocabulary word", "Use it in a sentence", "Explain what it means"],
];

function swapNames(text: string, seed: number): string {
  let out = text;
  for (const name of NAMES) {
    out = out.replace(new RegExp(`\\b${name}\\b`, "g"), NAMES[(NAMES.indexOf(name) + seed + 1) % NAMES.length]);
  }
  return out;
}

function swapPlaces(text: string, seed: number): string {
  return text.replace(/\b(park|school|library|garden|playground|kitchen|beach|farm)\b/gi, (match) => {
    const idx = PLACES.findIndex((p) => p.toLowerCase() === match.toLowerCase());
    const next = PLACES[((idx >= 0 ? idx : 0) + seed) % PLACES.length];
    return match[0] === match[0].toUpperCase() ? next[0].toUpperCase() + next.slice(1) : next;
  });
}

function swapAnimals(text: string, seed: number): string {
  return text.replace(/\b(mouse|lion|goat|farmer|bird|dog|cat|frog|butterfly|puppy)\b/gi, (match) => {
    const next = ANIMALS[(seed + match.length) % ANIMALS.length];
    return match[0] === match[0].toUpperCase() ? next[0].toUpperCase() + next.slice(1) : next;
  });
}

function bumpNumbers(text: string, seed: number): string {
  return text.replace(/\b(\d+)\b/g, (_, n) => String(Number(n) + seed));
}

function varyReading(baseQ: ActivityParams, seed: number, tier: number): ActivityParams {
  let passage = swapAnimals(swapPlaces(swapNames(String(baseQ.passage ?? ""), seed), seed), seed);
  passage = bumpNumbers(passage, seed % 5);
  passage = `${READING_LEADS[seed]} ${passage}`;
  const question = swapNames(String(baseQ.question ?? ""), seed);
  return { passage, question, answer: baseQ.answer, difficulty: tier };
}

function expandLanguage(baseQ: ActivityParams, seed: number, tier: number): ActivityParams {
  const sentence = String(baseQ.sentence);
  const fixed = String(baseQ.fixed);
  const nouns = ["dog", "cat", "bird", "fish", "horse", "mouse", "duck", "frog", "bear", "lion"];
  const places = ["store", "park", "school", "library", "zoo", "farm", "beach", "mall", "home", "yard"];
  const noun = nouns[seed];
  const place = places[seed];
  const capNoun = noun[0].toUpperCase() + noun.slice(1);
  const tag = LANGUAGE_TAGS[seed];

  let variedSentence = sentence
    .replace(/\bdog\b/g, noun)
    .replace(/\bcat\b/g, noun)
    .replace(/\bstore\b/g, place);
  let variedFixed = fixed
    .replace(/\bDog\b/g, capNoun)
    .replace(/\bCat\b/g, capNoun)
    .replace(/\bstore\b/g, place);

  if (variedSentence === sentence) {
    variedSentence = `${sentence} ${tag}`;
    variedFixed = fixed.endsWith(".") ? fixed.replace(/\.$/, ` ${tag}.`) : `${fixed} ${tag}`;
  }

  return { sentence: variedSentence, fixed: variedFixed, difficulty: tier };
}

function readingVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;

  const tier = difficultyForSeed(seed);
  const variantIndex = seed % 3;
  const baseQ = base[variantIndex];

  if ("passage" in baseQ && "question" in baseQ && "answer" in baseQ) {
    if (seed < 3) return { ...baseQ, difficulty: tier };
    return varyReading(baseQ, seed, tier);
  }

  return null;
}

function writingVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % 3];
  if ("prompt" in baseQ && "frame" in baseQ) {
    return {
      ...baseQ,
      prompt: WRITING_PROMPTS[seed % WRITING_PROMPTS.length],
      difficulty: tier,
    };
  }
  return null;
}

function languageVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % 3];
  if ("sentence" in baseQ && "fixed" in baseQ) {
    if (seed < 3) return { ...baseQ, difficulty: tier };
    return expandLanguage(baseQ, seed, tier);
  }
  return null;
}

function checklistVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const items = CHECKLIST_ITEMS[seed % CHECKLIST_ITEMS.length];
  return {
    items,
    prompt: tier === 3 ? "Complete every step carefully:" : "Complete this step:",
    difficulty: tier,
  };
}

export function generateElaQuestion(standardCode: string, seed: number): ActivityParams | null {
  return (
    readingVariant(standardCode, seed) ??
    writingVariant(standardCode, seed) ??
    languageVariant(standardCode, seed) ??
    checklistVariant(standardCode, seed)
  );
}
