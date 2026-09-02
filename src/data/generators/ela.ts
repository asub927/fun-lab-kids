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
  "Write about a favorite recess game.",
  "Write about how you help at home.",
  "Write about a science fact you remember.",
  "Write about a time you were kind.",
  "Write about your favorite season.",
  "Write about a pet or animal you know.",
  "Write about a song you like.",
  "Write about a place in your neighborhood.",
  "Write about how plants grow.",
  "Write about why friends matter.",
  "Write about a lunch you enjoy.",
  "Write about a sport or movement activity.",
  "Write about a holiday memory.",
  "Write about a problem you solved.",
  "Write about a teacher who helped you.",
  "Write about the night sky.",
  "Write about a museum or library visit.",
  "Write about how to be a good listener.",
  "Write about recycling at school.",
  "Write about a dream you have for the future.",
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
  "Before long,",
  "In the morning,",
  "That afternoon,",
  "By evening,",
  "Suddenly,",
];

const LANGUAGE_TAGS = [
  "today",
  "quickly",
  "outside",
  "again",
  "now",
  "here",
  "too",
  "also",
  "very",
  "well",
  "quietly",
  "happily",
  "slowly",
  "inside",
  "nearby",
];

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
  ["Preview headings", "Predict what you will learn", "Read the first paragraph"],
  ["Underline a key detail", "Restate it in your words", "Share with a partner"],
  ["Clap the syllables", "Blend the sounds", "Read the whole word"],
  ["Find the problem", "Find the solution", "Tell the ending"],
  ["Name the setting", "Name the characters", "Tell what happened"],
  ["Ask who", "Ask what", "Ask where"],
  ["Find a caption", "Read it carefully", "Connect it to the text"],
  ["Choose a verb", "Make it past tense", "Use it in a sentence"],
  ["Write a draft", "Add one detail", "Fix one capital"],
  ["Listen for a fact", "Listen for an opinion", "Explain the difference"],
  ["Point to punctuation", "Say how your voice should change", "Reread the sentence"],
  ["Find a text feature", "Say what it helps you do", "Use it to answer a question"],
  ["Retell beginning", "Retell middle", "Retell end"],
  ["Name a synonym", "Name an antonym", "Use one in a sentence"],
  ["Read a poem line", "Notice rhythm", "Read it with expression"],
  ["Find evidence", "Point to the sentence", "Explain your answer"],
  ["Plan your idea", "Say it in order", "Add a feeling word"],
  ["Check spacing", "Check letter size", "Check neatness"],
  ["Ask a clarifying question", "Repeat the answer", "Thank the speaker"],
  ["Choose a topic", "List two facts", "Write a closing sentence"],
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
  return text.replace(/\b(\d+)\b/g, (_, n) => String(Number(n) + (seed % 7)));
}

function varyReading(baseQ: ActivityParams, seed: number, tier: number): ActivityParams {
  let passage = swapAnimals(swapPlaces(swapNames(String(baseQ.passage ?? ""), seed), seed), seed);
  passage = bumpNumbers(passage, seed);
  passage = `${READING_LEADS[seed % READING_LEADS.length]} ${passage}`;
  const question = swapNames(String(baseQ.question ?? ""), seed);
  let answer = baseQ.answer;
  if (typeof answer === "string") {
    answer = swapNames(answer, seed);
  }
  return {
    passage,
    question,
    answer,
    difficulty: tier,
    practiceId: seed + 1,
  };
}

function expandLanguage(baseQ: ActivityParams, seed: number, tier: number): ActivityParams {
  const sentence = String(baseQ.sentence);
  const fixed = String(baseQ.fixed);
  const nouns = ["dog", "cat", "bird", "fish", "horse", "mouse", "duck", "frog", "bear", "lion", "goat", "fox"];
  const places = ["store", "park", "school", "library", "zoo", "farm", "beach", "mall", "home", "yard", "garden", "trail"];
  const noun = nouns[seed % nouns.length];
  const place = places[seed % places.length];
  const capNoun = noun[0].toUpperCase() + noun.slice(1);
  const tag = LANGUAGE_TAGS[seed % LANGUAGE_TAGS.length];

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
    variedFixed = fixed.endsWith(".")
      ? fixed.replace(/\.$/, ` ${tag}.`)
      : fixed.endsWith("?")
        ? fixed.replace(/\?$/, ` ${tag}?`)
        : fixed.endsWith("!")
          ? fixed.replace(/!$/, ` ${tag}!`)
          : `${fixed} ${tag}`;
  }

  return {
    sentence: variedSentence,
    fixed: variedFixed,
    difficulty: tier,
    practiceId: seed + 1,
  };
}

function readingVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;

  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % base.length];

  if ("passage" in baseQ && "question" in baseQ && "answer" in baseQ) {
    if (seed < base.length) return { ...baseQ, difficulty: tier, practiceId: seed + 1 };
    return varyReading(baseQ, seed, tier);
  }

  return null;
}

function writingVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % base.length];
  if ("prompt" in baseQ && "frame" in baseQ) {
    return {
      ...baseQ,
      prompt: WRITING_PROMPTS[seed % WRITING_PROMPTS.length],
      difficulty: tier,
      practiceId: seed + 1,
    };
  }
  return null;
}

function languageVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % base.length];
  if ("sentence" in baseQ && "fixed" in baseQ) {
    if (seed < base.length) return { ...baseQ, difficulty: tier, practiceId: seed + 1 };
    return expandLanguage(baseQ, seed, tier);
  }
  return null;
}

function checklistVariant(standardCode: string, seed: number): ActivityParams | null {
  const base = elaQuestionSets[standardCode];
  if (!base) return null;
  const tier = difficultyForSeed(seed);
  const baseQ = base[seed % base.length];
  const poolItems = CHECKLIST_ITEMS[seed % CHECKLIST_ITEMS.length];
  const items =
    seed < base.length && Array.isArray(baseQ.items) && baseQ.items.length > 0
      ? (baseQ.items as string[])
      : poolItems;
  return {
    items,
    prompt: tier === 3 ? "Complete every step carefully:" : "Complete this step:",
    difficulty: tier,
    practiceId: seed + 1,
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
