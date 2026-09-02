import type { Standard } from "../../types";
import type { ActivityParams } from "../activities";
import { QUESTIONS_PER_STANDARD } from "../questionSets/types";

export type DifficultyTier = 1 | 2 | 3;

/** Map any pool seed onto the L1/L2/L3 progression used within a 10-question session. */
export function difficultyForSeed(seed: number): DifficultyTier {
  const local = ((seed % QUESTIONS_PER_STANDARD) + QUESTIONS_PER_STANDARD) % QUESTIONS_PER_STANDARD;
  if (local < 3) return 1;
  if (local < 7) return 2;
  return 3;
}

const NAMES = [
  "Jordan",
  "Maya",
  "Noah",
  "Emma",
  "Lila",
  "Ben",
  "Ana",
  "Kai",
  "Zoe",
  "Leo",
  "Sam",
  "Nora",
  "Omar",
  "Jade",
  "Tyler",
];
const ITEMS = [
  "stickers",
  "marbles",
  "crayons",
  "books",
  "apples",
  "toys",
  "seeds",
  "coins",
  "cards",
  "blocks",
  "shells",
  "buttons",
  "pencils",
  "beans",
  "ribbons",
];

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

function seededNums(code: string, seed: number, tier: DifficultyTier): [number, number] {
  const base = code.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const spread = tier === 1 ? 40 : tier === 2 ? 70 : 90;
  const a = 8 + ((base + seed * 7) % spread);
  const b = 3 + ((base + seed * 13) % (tier === 1 ? 12 : tier === 2 ? 25 : 40));
  return [a, b];
}

function wordProblemStory(code: string, seed: number, tier: DifficultyTier): ActivityParams {
  const name = pick(NAMES, seed);
  const name2 = pick(NAMES, seed, 3);
  const item = pick(ITEMS, seed, 5);
  const [a, b] = seededNums(code, seed, tier);
  const add = seed % 2 === 0;

  const addTemplates = [
    `${name} has ${a} ${item}. ${name2} gives ${name} ${b} more. How many ${item} does ${name} have now?`,
    `There are ${a} ${item} on a shelf. The teacher adds ${b} more. How many ${item} are on the shelf?`,
    `${name} collects ${a} ${item}. Later ${name} finds ${b} more. What is the total?`,
    `${name} counted ${a} ${item} in a jar. ${name2} dropped in ${b} more. How many ${item} are in the jar?`,
    `A basket held ${a} ${item}. Someone added ${b} ${item}. How many ${item} are there now?`,
    `${name} bought ${a} ${item} and then bought ${b} more. How many ${item} did ${name} buy in all?`,
  ];
  const subTemplates = [
    `${name} had ${a + b} ${item}. ${name} gave ${b} to a friend. How many ${item} does ${name} have left?`,
    `There were ${a + b} ${item} in a box. ${b} were taken out. How many remain?`,
    `${name} started with ${a + b} ${item} and lost ${b}. How many ${item} are left?`,
    `A shelf had ${a + b} ${item}. ${name2} took ${b} away. How many ${item} stay on the shelf?`,
    `${name} packed ${a + b} ${item} for a trip and used ${b}. How many ${item} are left?`,
    `There were ${a + b} ${item} in a bag. ${b} spilled out. How many ${item} remain?`,
  ];
  const templates = add ? addTemplates : subTemplates;
  const story = templates[seed % templates.length];
  const answer = add ? a + b : a;

  return {
    story,
    answer,
    difficulty: tier,
    unit: code === "NC.2.MD.5" ? "inches" : undefined,
  };
}

export function generateMathQuestion(standard: Standard, seed: number): ActivityParams {
  const { code, activityType } = standard;
  const tier = difficultyForSeed(seed);

  if (activityType === "word-problem") {
    return wordProblemStory(code, seed, tier);
  }

  if (activityType === "numeric-flash" || activityType === "computation") {
    if (code === "NC.2.NBT.6") {
      const base = 10 + seed * 3 + tier * 5;
      const values = [base, base + 7 + tier, base + 3 + (seed % 5)];
      return { mode: "triple-add", values, answer: values.reduce((s, v) => s + v, 0), difficulty: tier };
    }
    const pairs: [number, number, string][] =
      tier === 1
        ? [
            [8, 7, "+"],
            [15, 9, "-"],
            [12, 5, "+"],
            [18, 6, "-"],
            [9, 4, "+"],
            [14, 8, "-"],
            [11, 6, "+"],
            [16, 7, "-"],
            [13, 9, "+"],
            [19, 5, "-"],
          ]
        : tier === 2
          ? [
              [34, 22, "+"],
              [56, 28, "+"],
              [63, 18, "-"],
              [45, 17, "-"],
              [38, 25, "+"],
              [72, 29, "-"],
              [41, 36, "+"],
              [85, 27, "-"],
              [54, 19, "+"],
              [67, 33, "-"],
            ]
          : [
              [87, 39, "-"],
              [156, 78, "-"],
              [234, 145, "+"],
              [512, 267, "-"],
              [198, 76, "+"],
              [305, 128, "-"],
              [421, 189, "+"],
              [640, 275, "-"],
              [278, 156, "+"],
              [593, 248, "-"],
            ];
    const [aBase, bBase, op] = pairs[(seed + code.length) % pairs.length];
    const a = aBase + Math.floor(seed / pairs.length);
    const b = bBase + (seed % 3);
    const answer = op === "+" ? a + b : a - b;
    return { a, b, op, answer, difficulty: tier };
  }

  if (activityType === "equal-groups") {
    if (code === "NC.2.OA.3") {
      const count = tier === 1 ? 8 + seed * 2 : tier === 2 ? 15 + seed * 2 : 23 + seed * 2;
      return { count, mode: "odd-even", answer: count % 2 === 0 ? "even" : "odd", difficulty: tier };
    }
    const rows = 2 + (seed % 6);
    const cols = 2 + (Math.floor(seed / 6) % 5);
    return {
      rows,
      cols,
      answer: rows * cols,
      prompt: `${rows} rows with ${cols} in each row. How many objects in all?`,
      difficulty: tier,
    };
  }

  if (activityType === "number-sense") {
    if (code === "NC.2.NBT.2") {
      const start = tier === 1 ? 100 + seed * 10 : tier === 2 ? 200 + seed * 10 : 500 + seed * 10;
      return { mode: "skip-count", start, step: 10, answer: start + 10, difficulty: tier };
    }
    if (code === "NC.2.NBT.3") {
      const h = tier === 1 ? 1 + (seed % 4) : tier === 2 ? 2 + (seed % 5) : 3 + (seed % 4);
      const t = (seed * 3 + tier) % 10;
      const o = (seed * 7 + Math.floor(seed / 10)) % 10;
      const number = h * 100 + t * 10 + o;
      return { mode: "expanded", number, answer: `${h * 100}+${t * 10}+${o}`, difficulty: tier };
    }
    if (code === "NC.2.NBT.8") {
      const base = tier === 1 ? 120 + seed * 10 : tier === 2 ? 350 + seed * 10 : 680 + seed * 5;
      const delta = tier === 1 ? 10 : 100;
      const op = seed % 2 === 0 ? "+" : "-";
      const answer = op === "+" ? base + delta : base - delta;
      return {
        mode: "mental-add",
        prompt: `What is ${base} ${op} ${delta}?`,
        base,
        delta,
        op,
        answer,
        difficulty: tier,
      };
    }
    const a = tier === 1 ? 200 + seed * 11 : tier === 2 ? 400 + seed * 13 : 600 + seed * 17;
    const b = a - (tier === 1 ? 15 + seed : tier === 2 ? 35 + seed * 2 : 50 + seed * 3);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return { mode: "compare", a, b, answer, difficulty: tier };
  }

  if (activityType === "measurement") {
    const objects = [
      "pencil",
      "eraser",
      "crayon",
      "marker",
      "book",
      "notebook",
      "folder",
      "desk",
      "table",
      "door",
      "ruler",
      "glue stick",
      "scissors",
      "backpack",
      "shoe",
    ];
    const object = objects[seed % objects.length];
    const useMetric = seed % 10 >= 7 || tier === 3;
    const length = useMetric ? 1 + (seed % 3) : 3 + (seed % 8) + tier;
    const unit = useMetric ? (length === 1 ? "meter" : "meters") : "inches";
    const tool = useMetric ? "meter stick" : "ruler";

    if (code === "NC.2.MD.2") {
      const inches = 3 + (seed % 6) + tier + Math.floor(seed / 10);
      const clips = inches + 2 + (seed % 3);
      return {
        mode: "measure-twice",
        object,
        measure1: { value: inches, unit: "inches" },
        measure2: { value: clips, unit: "paper clips" },
        length: inches,
        answer: inches,
        difficulty: tier,
        prompt: `Measure the ${object} twice with different units. How long is it in inches?`,
      };
    }

    if (code === "NC.2.MD.3") {
      const estimateLength = length + Math.floor(seed / 10);
      return {
        mode: "estimate",
        object,
        length: estimateLength,
        unit,
        answer: estimateLength,
        difficulty: tier,
        prompt: `About how many ${unit} long is the ${object}? Make your best estimate.`,
      };
    }

    if (code === "NC.2.MD.4") {
      const objectA = object;
      const objectB = objects[(seed + 3) % objects.length];
      const lengthA = 3 + (seed % 5) + Math.floor(seed / 15);
      const lengthB = lengthA + 2 + (seed % 4);
      const difference = lengthB - lengthA;
      return {
        mode: "compare-length",
        objectA,
        objectB,
        lengthA,
        lengthB,
        length: difference,
        answer: difference,
        difficulty: tier,
        prompt: `How much longer is the ${objectB} than the ${objectA}?`,
      };
    }

    if (code === "NC.2.MD.6") {
      const start = tier === 1 ? 2 + seed : tier === 2 ? 5 + seed : 10 + seed * 2;
      const jump = tier === 1 ? 3 + (seed % 4) : tier === 2 ? 5 + (seed % 5) : 8 + (seed % 4);
      const end = start + jump;
      return {
        mode: "number-line",
        start,
        end,
        min: 0,
        max: Math.max(20, end + 2),
        length: jump,
        answer: jump,
        difficulty: tier,
        prompt: `On the number line, how far is it from ${start} to ${end}?`,
      };
    }

    const measureLength = length + Math.floor(seed / 10);
    return {
      mode: "measure",
      object,
      tool,
      length: measureLength,
      unit,
      answer: measureLength,
      difficulty: tier,
      prompt: `How long is the ${object}? Line it up with the ${tool}.`,
    };
  }

  if (activityType === "time-money") {
    if (code === "NC.2.MD.7") {
      const hour = tier === 1 ? 1 + (seed % 6) : tier === 2 ? 7 + (seed % 4) : 10 + (seed % 2);
      const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      const minute = minuteOptions[seed % minuteOptions.length];
      // Keep hours in a sensible 1–12 range while varying by seed
      const displayHour = ((hour - 1 + Math.floor(seed / minuteOptions.length)) % 12) + 1;
      const time = `${displayHour}:${minute.toString().padStart(2, "0")}`;
      return {
        time,
        answer: time,
        difficulty: tier,
        prompt: "What time does the clock show?",
      };
    }
    const quarterCount = 1 + (seed % 3);
    const dimeCount = seed % 4;
    const nickelCount = (seed + tier) % 3;
    const pennyCount = seed % 5;
    // Nudge counts slightly by pool band so revisit slices stay unique
    const band = Math.floor(seed / 10);
    const cents =
      quarterCount * 25 +
      dimeCount * 10 +
      nickelCount * 5 +
      pennyCount +
      band;
    const coinParts = [
      quarterCount ? `${quarterCount} quarter${quarterCount > 1 ? "s" : ""}` : "",
      dimeCount ? `${dimeCount} dime${dimeCount > 1 ? "s" : ""}` : "",
      nickelCount ? `${nickelCount} nickel${nickelCount > 1 ? "s" : ""}` : "",
      pennyCount + band
        ? `${pennyCount + band} penn${pennyCount + band === 1 ? "y" : "ies"}`
        : "",
    ].filter(Boolean);
    return {
      coins: coinParts.join(", "),
      cents,
      answer: cents,
      difficulty: tier,
      prompt: "How many cents are these coins worth in all?",
    };
  }

  if (activityType === "data-chart") {
    const sets = [
      {
        categories: ["Red", "Blue", "Green"],
        counts: [4 + (seed % 3), 7 + (seed % 4), 3 + (seed % 2)],
        question: "How many more Blue than Red?",
      },
      {
        categories: ["Cat", "Dog", "Fish"],
        counts: [5 + (seed % 2), 8 + (seed % 3), 2 + (seed % 2)],
        question: "How many pets in all?",
      },
      {
        categories: ["Mon", "Tue", "Wed"],
        counts: [6 + (seed % 2), 6 + (seed % 3), 9 + (seed % 2)],
        question: "How many more on Wed than Mon?",
      },
      {
        categories: ["Apple", "Pear", "Grape"],
        counts: [3 + (seed % 4), 5 + (seed % 3), 4 + (seed % 2)],
        question: "How many fruits in all?",
      },
      {
        categories: ["Bus", "Car", "Bike"],
        counts: [2 + (seed % 3), 9 + (seed % 2), 4 + (seed % 4)],
        question: "How many more Car than Bus?",
      },
      {
        categories: ["Sun", "Cloud", "Rain"],
        counts: [7 + (seed % 2), 3 + (seed % 3), 5 + (seed % 2)],
        question: "How many weather days in all?",
      },
    ];
    const set = sets[seed % sets.length];
    const band = Math.floor(seed / sets.length);
    const counts = set.counts.map((n, i) => n + band + (i === 0 ? 0 : seed % 2));
    const [a, b, c] = counts;
    const answer = set.question.includes("more")
      ? Math.abs(b - a)
      : set.question.includes("all")
        ? a + b + c
        : c - a;
    return {
      categories: set.categories,
      counts,
      question: set.question,
      answer,
      difficulty: tier,
      prompt: set.question,
    };
  }

  if (activityType === "geometry") {
    if (code === "NC.2.G.3") {
      const shapes = [
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square",
        "circle",
        "rectangle",
        "circle",
        "square",
        "rectangle",
        "circle",
        "square",
      ];
      const partCount = 2 + (seed % 3);
      const names = ["halves", "thirds", "fourths"] as const;
      const answer = names[partCount === 2 ? 0 : partCount === 3 ? 1 : 2];
      return {
        shape: shapes[seed % shapes.length],
        parts: partCount,
        mode: "equal-shares",
        answer,
        options: ["halves", "thirds", "fourths"],
        difficulty: tier,
        prompt: `Card ${seed + 1}: This ${shapes[seed % shapes.length]} is split into ${partCount} equal parts. What do we call the equal shares?`,
      };
    }

    const shapes = [
      { shape: "triangle", sides: 3 },
      { shape: "square", sides: 4 },
      { shape: "rectangle", sides: 4 },
      { shape: "pentagon", sides: 5 },
      { shape: "hexagon", sides: 6 },
      { shape: "octagon", sides: 8 },
      { shape: "trapezoid", sides: 4 },
      { shape: "heptagon", sides: 7 },
      { shape: "nonagon", sides: 9 },
      { shape: "decagon", sides: 10 },
    ];
    const chosen = shapes[seed % shapes.length];
    const countSides = code === "NC.2.G.1" ? seed % 2 === 0 : seed % 2 === 1;
    if (countSides) {
      return {
        ...chosen,
        mode: "count-sides",
        answer: chosen.sides,
        difficulty: tier,
        prompt: `Card ${seed + 1}: How many sides does this shape have?`,
      };
    }
    return {
      ...chosen,
      mode: "identify",
      answer: chosen.shape,
      difficulty: tier,
      prompt: `Card ${seed + 1}: What shape is this?`,
    };
  }

  return { prompt: `${standard.text} (practice ${seed + 1})`, difficulty: tier };
}
