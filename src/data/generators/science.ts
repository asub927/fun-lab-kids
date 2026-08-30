import type { ActivityParams } from "../activities";
import { difficultyForSeed } from "./math";
import { scienceQuestionSets } from "../questionSets/scienceContent";

const SOUND_PROMPTS = [
  "What vibrates to make a guitar string sound?",
  "What vibrates when you hum a song?",
  "What part of a drum vibrates to make sound?",
  "What vibrates when you pluck a rubber band?",
  "What vibrates on a tuning fork to make a ping?",
  "What vibrates when you blow into a recorder?",
  "What vibrates when a bell is rung?",
  "What vibrates when you tap two sticks together?",
  "What makes a bee's wings buzz?",
  "What vibrates in a speaker to play music?",
];

const SOUND_ANSWERS = [
  "the guitar string vibrates",
  "your vocal cords vibrate",
  "the drum head vibrates",
  "the rubber band vibrates",
  "the tuning fork vibrates",
  "the air column vibrates",
  "the bell vibrates",
  "the sticks vibrate",
  "the wings vibrate",
  "the speaker cone vibrates",
];

const MATTER_PROMPTS = [
  "Does water volume change when it freezes?",
  "Does ice weigh more or less than the same amount of liquid water?",
  "What happens to the shape of water when it freezes?",
  "What state is steam?",
  "What happens to ice when it melts?",
  "Can a solid turn into a liquid?",
  "What state is juice in a cup?",
  "What happens to puddles on a sunny day?",
  "Does a rock change shape when heated a little?",
  "What state is the air around you?",
];

const MATTER_ANSWERS = [
  "no volume change",
  "same weight",
  "becomes solid",
  "gas",
  "becomes liquid",
  "yes it melts",
  "liquid",
  "evaporates",
  "no not much",
  "gas",
];

const WEATHER_PROMPTS = [
  "Which tool measures wind speed?",
  "What do we call frozen rain that falls from clouds?",
  "Name two words we use to describe weather.",
  "What tool measures temperature?",
  "What tool shows wind direction?",
  "What tool collects rain to measure precipitation?",
  "What does a thermometer measure?",
  "What season is typically warmest?",
  "What source of energy warms the land during the day?",
  "Name one thing the sun's energy helps plants do.",
];

const WEATHER_ANSWERS = [
  "anemometer",
  "sleet or hail",
  "temperature and wind",
  "thermometer",
  "weather vane",
  "rain gauge",
  "temperature",
  "summer",
  "sun",
  "grow or photosynthesis",
];

const LIFE_PROMPTS = [
  "What comes first in a butterfly life cycle?",
  "What stage comes after a caterpillar?",
  "What does a tadpole become?",
  "Name one change frogs go through.",
  "What do baby chicks need to grow?",
  "What stage is an egg in a life cycle?",
  "What happens before a butterfly can fly?",
  "Name one animal that starts as an egg.",
  "What do plants need to grow from a seed?",
  "What changes as a seed grows into a plant?",
];

const LIFE_ANSWERS = [
  "egg",
  "chrysalis or pupa",
  "frog",
  "grows legs",
  "food and warmth",
  "beginning",
  "it forms a chrysalis",
  "bird or butterfly",
  "water and sunlight",
  "it gets taller",
];

const HEREDITY_PROMPTS = [
  "How might a puppy look like its parents?",
  "How might it look different?",
  "Name one behavior animals learn from parents.",
  "Why are siblings in a family not exactly alike?",
  "What word means differences among related individuals?",
  "Give one example of variation in a litter of kittens.",
  "Name one trait a calf might inherit from a cow.",
  "How can two plants from the same seed packet differ?",
  "What makes twins look similar but not identical?",
  "Name one learned behavior a bird teaches its young.",
];

const HEREDITY_ANSWERS = [
  "same fur color or size",
  "different markings",
  "hunting or nesting",
  "different traits",
  "variation",
  "different colors or sizes",
  "coat color or size",
  "different height or leaf shape",
  "same genes but small differences",
  "finding food or flying",
];

function inquiryPool(standardCode: string): { prompts: string[]; answers: string[] } | null {
  if (standardCode.startsWith("2.P.1")) return { prompts: SOUND_PROMPTS, answers: SOUND_ANSWERS };
  if (standardCode.startsWith("2.P.2")) return { prompts: MATTER_PROMPTS, answers: MATTER_ANSWERS };
  if (standardCode.startsWith("2.E.1")) return { prompts: WEATHER_PROMPTS, answers: WEATHER_ANSWERS };
  if (standardCode.startsWith("2.L.1")) return { prompts: LIFE_PROMPTS, answers: LIFE_ANSWERS };
  if (standardCode.startsWith("2.L.2")) return { prompts: HEREDITY_PROMPTS, answers: HEREDITY_ANSWERS };
  return null;
}

export function generateScienceQuestion(standardCode: string, seed: number): ActivityParams | null {
  const tier = difficultyForSeed(seed);
  const pool = inquiryPool(standardCode);

  if (pool) {
    return {
      scenario: "inquiry",
      prompt: pool.prompts[seed % pool.prompts.length],
      answer: pool.answers[seed % pool.answers.length],
      difficulty: tier,
    };
  }

  const base = scienceQuestionSets[standardCode];
  if (!base) return null;
  const q = base[seed % 3];
  return { ...q, difficulty: tier };
}
