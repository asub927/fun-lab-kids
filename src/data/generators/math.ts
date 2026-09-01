import type { Standard } from "../../types";
import type { ActivityParams } from "../activities";

export type DifficultyTier = 1 | 2 | 3;

export function difficultyForSeed(seed: number): DifficultyTier {
  if (seed < 3) return 1;
  if (seed < 7) return 2;
  return 3;
}

const NAMES = ["Jordan", "Maya", "Noah", "Emma", "Lila", "Ben", "Ana", "Kai", "Zoe", "Leo"];
const ITEMS = ["stickers", "marbles", "crayons", "books", "apples", "toys", "seeds", "coins", "cards", "blocks"];

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

function wordProblemStory(
  code: string,
  seed: number,
  tier: DifficultyTier,
): ActivityParams {
  const name = pick(NAMES, seed);
  const name2 = pick(NAMES, seed, 3);
  const item = pick(ITEMS, seed, 5);
  const [a, b] = seededNums(code, seed, tier);
  const add = seed % 2 === 0;

  const addTemplates = [
    `${name} has ${a} ${item}. ${name2} gives ${name} ${b} more. How many ${item} does ${name} have now?`,
    `There are ${a} ${item} on a shelf. The teacher adds ${b} more. How many ${item} are on the shelf?`,
    `${name} collects ${a} ${item}. Later ${name} finds ${b} more. What is the total?`,
  ];
  const subTemplates = [
    `${name} had ${a + b} ${item}. ${name} gave ${b} to a friend. How many ${item} does ${name} have left?`,
    `There were ${a + b} ${item} in a box. ${b} were taken out. How many remain?`,
    `${name} started with ${a + b} ${item} and lost ${b}. How many ${item} are left?`,
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
      const values = [base, base + 7 + tier, base + 3];
      return { mode: "triple-add", values, answer: values.reduce((s, v) => s + v, 0), difficulty: tier };
    }
    const pairs: [number, number, string][] =
      tier === 1
        ? [
            [8, 7, "+"],
            [15, 9, "-"],
            [12, 5, "+"],
            [18, 6, "-"],
          ]
        : tier === 2
          ? [
              [34, 22, "+"],
              [56, 28, "+"],
              [63, 18, "-"],
              [45, 17, "-"],
            ]
          : [
              [87, 39, "-"],
              [156, 78, "-"],
              [234, 145, "+"],
              [512, 267, "-"],
            ];
    const [a, b, op] = pairs[(seed + code.length) % pairs.length];
    const answer = op === "+" ? a + b : a - b;
    return { a, b, op, answer, difficulty: tier };
  }

  if (activityType === "equal-groups") {
    if (code === "NC.2.OA.3") {
      const count = tier === 1 ? 8 + seed * 2 : tier === 2 ? 15 + seed * 2 : 23 + seed * 2;
      return { count, mode: "odd-even", answer: count % 2 === 0 ? "even" : "odd", difficulty: tier };
    }
    const rows = 2 + ((seed + tier) % 4);
    const cols = 2 + ((seed * 2 + tier) % 5);
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
      const o = (seed * 7) % 10;
      const number = h * 100 + t * 10 + o;
      return { mode: "expanded", number, answer: `${h * 100}+${t * 10}+${o}`, difficulty: tier };
    }
    if (code === "NC.2.NBT.8") {
      const base = tier === 1 ? 120 + seed * 10 : tier === 2 ? 350 + seed * 10 : 680 + seed * 5;
      const delta = tier === 1 ? 10 : 100;
      const op = seed % 2 === 0 ? "+" : "-";
      return { base, delta, op, answer: op === "+" ? base + delta : base - delta, difficulty: tier };
    }
    const a = tier === 1 ? 200 + seed * 11 : tier === 2 ? 400 + seed * 13 : 600 + seed * 17;
    const b = a - (tier === 1 ? 15 + seed : tier === 2 ? 35 + seed * 2 : 50 + seed * 3);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return { mode: "compare", a, b, answer, difficulty: tier };
  }

  if (activityType === "measurement") {
    const objects = ["pencil", "eraser", "crayon", "marker", "book", "notebook", "folder", "desk", "table", "door"];
    const object = objects[seed];
    const useMetric = seed >= 7 || tier === 3;
    const length = useMetric ? 1 + (seed % 3) : 3 + (seed % 8) + tier;
    const unit = useMetric ? (length === 1 ? "meter" : "meters") : "inches";
    const tool = useMetric ? "meter stick" : "ruler";
    return {
      object,
      tool,
      length,
      unit,
      answer: length,
      difficulty: tier,
      prompt: `How long is the ${object}? Line it up with the ${tool}.`,
    };
  }

  if (activityType === "time-money") {
    if (code === "NC.2.MD.7") {
      const hour = tier === 1 ? 1 + (seed % 6) : tier === 2 ? 7 + (seed % 4) : 10 + (seed % 2);
      const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
      const minute = minuteOptions[seed];
      const time = `${hour}:${minute.toString().padStart(2, "0")}`;
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
    const cents = quarterCount * 25 + dimeCount * 10 + nickelCount * 5 + pennyCount;
    const coinParts = [
      quarterCount ? `${quarterCount} quarter${quarterCount > 1 ? "s" : ""}` : "",
      dimeCount ? `${dimeCount} dime${dimeCount > 1 ? "s" : ""}` : "",
      nickelCount ? `${nickelCount} nickel${nickelCount > 1 ? "s" : ""}` : "",
      pennyCount ? `${pennyCount} penn${pennyCount === 1 ? "y" : "ies"}` : "",
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
      { categories: ["Red", "Blue", "Green"], counts: [4 + seed % 3, 7 + seed % 4, 3 + seed % 2], question: "How many more Blue than Red?", answer: 0 },
      { categories: ["Cat", "Dog", "Fish"], counts: [5 + seed % 2, 8 + seed % 3, 2 + seed % 2], question: "How many pets in all?", answer: 0 },
      { categories: ["Mon", "Tue", "Wed"], counts: [6 + seed % 2, 6 + seed % 3, 9 + seed % 2], question: "How many more on Wed than Mon?", answer: 0 },
    ];
    const set = sets[seed % sets.length];
    const [a, b, c] = set.counts;
    const answer =
      set.question.includes("more")
        ? Math.max(b, a) - Math.min(b, a)
        : set.question.includes("all")
          ? a + b + c
          : c - a;
    return { ...set, answer, difficulty: tier, prompt: set.question };
  }

  if (activityType === "geometry") {
    if (code === "NC.2.G.3") {
      // NC.2.G.3 focuses on circles and rectangles into 2–4 equal shares
      const shapes = ["rectangle", "circle", "rectangle", "circle", "square", "circle", "rectangle", "circle", "square", "rectangle"];
      const partCount = 2 + (seed % 3);
      const names = ["halves", "thirds", "fourths"] as const;
      const answer = names[partCount === 2 ? 0 : partCount === 3 ? 1 : 2];
      return {
        shape: shapes[seed],
        parts: partCount,
        mode: "equal-shares",
        answer,
        options: ["halves", "thirds", "fourths"],
        difficulty: tier,
        prompt: "This shape is split into equal parts. What do we call the equal shares?",
      };
    }

    // NC.2.G.1 — recognize shapes by attributes (show visual, hide the name)
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
    const pick = shapes[seed % shapes.length];
    const countSides = seed % 2 === 1;
    if (countSides) {
      return {
        ...pick,
        mode: "count-sides",
        answer: pick.sides,
        difficulty: tier,
        prompt: "How many sides does this shape have?",
      };
    }
    return {
      ...pick,
      mode: "identify",
      answer: pick.shape,
      difficulty: tier,
      prompt: "What shape is this?",
    };
  }

  return { prompt: standard.text, difficulty: tier };
}
