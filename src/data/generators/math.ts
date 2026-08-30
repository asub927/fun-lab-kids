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
    prompt: story,
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
      return {
        mode: "triple-add",
        values,
        answer: values.reduce((s, v) => s + v, 0),
        prompt: `Add: ${values.join(" + ")}`,
        difficulty: tier,
      };
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
    return { a, b, op, answer, prompt: `${a} ${op} ${b} = ?`, difficulty: tier };
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
      return {
        mode: "skip-count",
        start,
        step: 10,
        answer: start + 10,
        prompt: `Skip-count by 10 starting at ${start}. What comes next?`,
        difficulty: tier,
      };
    }
    if (code === "NC.2.NBT.3") {
      const h = tier === 1 ? 1 + (seed % 4) : tier === 2 ? 2 + (seed % 5) : 3 + (seed % 4);
      const t = (seed * 3 + tier) % 10;
      const o = (seed * 7) % 10;
      const number = h * 100 + t * 10 + o;
      return {
        mode: "expanded",
        number,
        answer: `${h * 100}+${t * 10}+${o}`,
        prompt: `Write ${number} in expanded form (e.g. 300+50+2).`,
        difficulty: tier,
      };
    }
    if (code === "NC.2.NBT.8") {
      const base = tier === 1 ? 120 + seed * 10 : tier === 2 ? 350 + seed * 10 : 680 + seed * 5;
      const delta = tier === 1 ? 10 : 100;
      const op = seed % 2 === 0 ? "+" : "-";
      const answer = op === "+" ? base + delta : base - delta;
      return {
        mode: "mental-add",
        base,
        delta,
        op,
        answer,
        prompt: `${base} ${op} ${delta} = ?`,
        difficulty: tier,
      };
    }
    const a = tier === 1 ? 200 + seed * 11 : tier === 2 ? 400 + seed * 13 : 600 + seed * 17;
    const b = a - (tier === 1 ? 15 + seed : tier === 2 ? 35 + seed * 2 : 50 + seed * 3);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      mode: "compare",
      a,
      b,
      answer,
      prompt: `Compare ${a} and ${b}. Which symbol is correct: >, <, or =?`,
      difficulty: tier,
    };
  }

  if (activityType === "measurement") {
    const objects = ["pencil", "eraser", "crayon", "marker", "book", "notebook", "folder", "desk", "table", "door"];
    const object = objects[seed];

    if (code === "NC.2.MD.2") {
      const inches = 3 + seed + tier;
      const centimeters = inches + 2 + (seed % 3);
      return {
        mode: "measure-twice",
        object,
        measure1: { value: inches, unit: "inches" },
        measure2: { value: centimeters, unit: "centimeters" },
        prompt: `The ${object} was measured twice. How many inches long is it?`,
        answer: inches,
        length: inches,
        unit: "inches",
        difficulty: tier,
      };
    }

    if (code === "NC.2.MD.3") {
      const unit = seed % 2 === 0 ? "inches" : "centimeters";
      const length = unit === "inches" ? 4 + seed + tier : 8 + seed * 2 + tier;
      return {
        mode: "estimate",
        object,
        unit,
        length,
        prompt: `About how many ${unit} long is a ${object}? Type your best estimate.`,
        answer: length,
        difficulty: tier,
      };
    }

    if (code === "NC.2.MD.4") {
      const objectsPair = [
        ["pencil", "marker"],
        ["book", "folder"],
        ["crayon", "eraser"],
        ["notebook", "desk"],
        ["table", "door"],
      ][seed % 5];
      const lengthA = 5 + seed + tier;
      const lengthB = 2 + seed;
      const longer = lengthA >= lengthB ? objectsPair[0] : objectsPair[1];
      const shorter = longer === objectsPair[0] ? objectsPair[1] : objectsPair[0];
      const diff = Math.abs(lengthA - lengthB);
      return {
        mode: "compare-length",
        objectA: objectsPair[0],
        lengthA,
        objectB: objectsPair[1],
        lengthB,
        prompt: `How much longer is the ${longer} than the ${shorter}?`,
        answer: diff,
        length: diff,
        unit: "inches",
        difficulty: tier,
      };
    }

    if (code === "NC.2.MD.6") {
      const start = tier === 1 ? 2 + (seed % 6) : tier === 2 ? 5 + (seed % 8) : 8 + (seed % 7);
      const delta = tier === 1 ? 3 + (seed % 4) : tier === 2 ? 5 + (seed % 5) : 7 + (seed % 4);
      const forward = seed % 2 === 0;
      const answer = forward ? start + delta : start - delta;
      return {
        mode: "number-line",
        start,
        delta,
        op: forward ? "+" : "-",
        answer,
        end: answer,
        prompt: `Start at ${start} on the number line. Move ${delta} ${forward ? "forward" : "back"}. What number do you land on?`,
        difficulty: tier,
      };
    }

    const useMetric = seed >= 7 || tier === 3;
    const length = useMetric ? 1 + (seed % 3) : 3 + seed + tier;
    const unit = useMetric ? (length === 1 ? "meter" : "meters") : "inches";
    const tool = useMetric ? "meter stick" : "ruler";
    return {
      mode: "measure",
      object,
      tool,
      length,
      unit,
      prompt: `Use a ${tool}. How many ${unit} long is the ${object}?`,
      difficulty: tier,
    };
  }

  if (activityType === "time-money") {
    if (code === "NC.2.MD.7") {
      const hour = tier === 1 ? 1 + (seed % 6) : tier === 2 ? 7 + (seed % 4) : 10 + (seed % 2);
      const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
      const minute = minuteOptions[seed];
      const time = `${hour}:${minute.toString().padStart(2, "0")}`;
      return {
        mode: "clock",
        time,
        answer: time,
        prompt: "What time does the clock show? Write it like 3:15.",
        difficulty: tier,
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
    const coins = coinParts.join(", ");
    return {
      mode: "money",
      coins,
      cents,
      answer: cents,
      prompt: `Count the coins: ${coins}. How many cents in all?`,
      difficulty: tier,
    };
  }

  if (activityType === "data-chart") {
    const sets = [
      { categories: ["Red", "Blue", "Green"], counts: [4 + (seed % 3), 7 + (seed % 4), 3 + (seed % 2)] },
      { categories: ["Cat", "Dog", "Fish"], counts: [5 + (seed % 2), 8 + (seed % 3), 2 + (seed % 2)] },
      { categories: ["Mon", "Tue", "Wed"], counts: [6 + (seed % 2), 6 + (seed % 3), 9 + (seed % 2)] },
    ];
    const templates = [
      (cats: string[], counts: number[]) => ({
        question: `How many more ${cats[1]} than ${cats[0]}?`,
        answer: counts[1] - counts[0],
      }),
      (cats: string[], counts: number[]) => ({
        question: `How many ${cats.join(", ")} in all?`,
        answer: counts.reduce((sum, value) => sum + value, 0),
      }),
      (cats: string[], counts: number[]) => ({
        question: `How many more on ${cats[2]} than ${cats[0]}?`,
        answer: counts[2] - counts[0],
      }),
    ];
    const set = sets[seed % sets.length];
    const template = templates[seed % templates.length];
    const { question, answer } = template(set.categories, set.counts);
    return {
      ...set,
      question,
      answer,
      prompt: question,
      difficulty: tier,
    };
  }

  if (activityType === "geometry") {
    if (code === "NC.2.G.3") {
      const shapes = ["rectangle", "circle", "square", "triangle", "hexagon", "rectangle", "circle", "square", "triangle", "hexagon"];
      const partCount = 2 + (seed % 3);
      const names = ["halves", "thirds", "fourths"];
      const answer = names[partCount === 2 ? 0 : partCount === 3 ? 1 : 2];
      return {
        shape: shapes[seed],
        parts: partCount,
        answer,
        prompt: `Split the ${shapes[seed]} into ${partCount} equal parts. What are the parts called?`,
        difficulty: tier,
      };
    }
    const shapes = [
      { shape: "triangle", sides: 3 },
      { shape: "square", sides: 4 },
      { shape: "rectangle", sides: 4 },
      { shape: "pentagon", sides: 5 },
      { shape: "hexagon", sides: 6 },
      { shape: "octagon", sides: 8 },
      { shape: "decagon", sides: 10 },
      { shape: "heptagon", sides: 7 },
      { shape: "nonagon", sides: 9 },
      { shape: "trapezoid", sides: 4 },
    ];
    const pickShape = shapes[seed];
    return {
      ...pickShape,
      answer: pickShape.sides,
      prompt: `How many sides does a ${pickShape.shape} have?`,
      difficulty: tier,
    };
  }

  return { prompt: standard.text, difficulty: tier };
}
