import type { ActivityParams } from "./activities";
import type { QuestionNudge } from "./strategies/types";

function numbersInText(text: string): number[] {
  return (text.match(/\d+/g) ?? []).map(Number);
}

function firstSentence(text: string): string {
  const s = text.split(/[.!?]/)[0]?.trim();
  return s && s.length > 0 ? s : text.slice(0, 80);
}

/** Per-question nudges derived from the actual problem content */
export function questionSpecificStrategy(
  activityType: string,
  params: ActivityParams,
): QuestionNudge | null {
  switch (activityType) {
    case "word-problem":
      return wordProblemNudge(params);
    case "numeric-flash":
    case "computation":
      return computationNudge(params);
    case "equal-groups":
      return equalGroupsNudge(params);
    case "number-sense":
      return numberSenseNudge(params);
    case "measurement":
      return measurementNudge(params);
    case "time-money":
      return timeMoneyNudge(params);
    case "data-chart":
      return dataChartNudge(params);
    case "geometry":
      return geometryNudge(params);
    case "reading-response":
      return readingNudge(params);
    case "science-inquiry":
      return scienceNudge(params);
    case "language-edit":
      return languageEditNudge(params);
    case "writing-frame":
      return writingFrameNudge(params);
    case "checklist":
      return checklistNudge(params);
    default:
      return null;
  }
}

function wordProblemNudge(params: ActivityParams): QuestionNudge | null {
  const story = String(params.story ?? "");
  if (!story) return null;

  const nums = numbersInText(story);
  const [n1, n2] = nums;
  const isAdd = /\b(more|adds?|added|gives?|total|in all|altogether|joins?|together)\b/i.test(story);
  const isSub = /\b(left|gave away|gave|cuts? off|uses?|saws? off|remains?|fewer|less| flew away| ate| lost| sold)\b/i.test(story);

  if (isAdd && n1 !== undefined && n2 !== undefined) {
    return {
      strategy: "Clue: put together (+)",
      strategySteps: [
        `Circle the two numbers in the story: ${n1} and ${n2}.`,
        `Words like "${story.match(/\b(more|adds?|gives?)\b/i)?.[0] ?? "more"}" mean addition.`,
        `Set up: ${n1} + ${n2}. Add the ones, then the tens.`,
        `Estimate first. Your answer should be near ${Math.round((n1 + n2) / 10) * 10}.`,
      ],
    };
  }

  if (isSub && n1 !== undefined && n2 !== undefined) {
    const start = Math.max(n1, n2);
    const taken = Math.min(n1, n2);
    return {
      strategy: "Clue: take away (−)",
      strategySteps: [
        `What do you start with? ${start}.`,
        `What goes away? ${taken}.`,
        `Set up: ${start} − ${taken}.`,
        `Subtract ones, then tens. Does your answer make sense?`,
      ],
    };
  }

  if (nums.length >= 2) {
    return {
      strategy: "Pick add or subtract",
      strategySteps: [
        `Numbers in the story: ${nums.join(", ")}.`,
        "Ask: Are you putting together or taking away?",
        "Write an equation and solve.",
      ],
    };
  }

  return null;
}

function computationNudge(params: ActivityParams): QuestionNudge | null {
  if (params.mode === "triple-add" && Array.isArray(params.values)) {
    const values = params.values as number[];
    return {
      strategy: "Add three numbers",
      strategySteps: [
        `Add in any order: ${values.join(", ")}.`,
        `Try ${values[0]} + ${values[1]} first, then add ${values[2]}.`,
        "Regroup if ones add up to 10 or more.",
      ],
    };
  }
  const a = Number(params.a);
  const b = Number(params.b);
  const op = String(params.op ?? "+");
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const verb = op === "+" ? "Add" : "Subtract";
  return {
    strategy: `${verb} mentally`,
    strategySteps: [
      `Problem: ${a} ${op} ${b}.`,
      op === "+"
        ? "Add ones, then tens. Make a ten if it helps."
        : "Start with the bigger number and count back, or subtract tens then ones.",
      "Say the fact aloud, then type your answer.",
    ],
  };
}

function equalGroupsNudge(params: ActivityParams): QuestionNudge | null {
  if (params.mode === "odd-even") {
    const count = Number(params.count);
    return {
      strategy: "Pair up to test odd/even",
      strategySteps: [
        `Picture ${count} objects in pairs.`,
        "If every object has a partner → even.",
        "If one is left over → odd.",
      ],
    };
  }
  const rows = Number(params.rows);
  const cols = Number(params.cols);
  if (!Number.isNaN(rows) && !Number.isNaN(cols)) {
    return {
      strategy: "Rows × columns",
      strategySteps: [
        `Draw ${rows} rows with ${cols} in each row.`,
        `Skip-count by ${cols}: ${Array.from({ length: rows }, (_, i) => (i + 1) * cols).join(", ")}.`,
        `Or multiply: ${rows} × ${cols}.`,
      ],
    };
  }
  return null;
}

function numberSenseNudge(params: ActivityParams): QuestionNudge | null {
  if (params.mode === "compare") {
    const a = Number(params.a);
    const b = Number(params.b);
    return {
      strategy: "Compare digit by digit",
      strategySteps: [
        `Compare ${a} and ${b}.`,
        "Start with the hundreds place, then tens, then ones.",
        "Use > (greater), < (less), or = (same).",
      ],
    };
  }
  if (params.mode === "expanded") {
    const n = Number(params.number);
    const h = Math.floor(n / 100) * 100;
    const t = Math.floor((n % 100) / 10) * 10;
    const o = n % 10;
    return {
      strategy: "Break apart the number",
      strategySteps: [
        `${n} has ${Math.floor(n / 100)} hundred(s), ${Math.floor((n % 100) / 10)} ten(s), ${o} one(s).`,
        `Write: ${h} + ${t} + ${o}.`,
      ],
    };
  }
  if (params.mode === "skip-count") {
    const start = Number(params.start);
    const step = Number(params.step);
    return {
      strategy: "Skip-count forward",
      strategySteps: [
        `Start at ${start}.`,
        `Count by ${step}: ${start}, ${start + step}, …`,
        "What number comes next?",
      ],
    };
  }
  if (params.base !== undefined && params.delta !== undefined) {
    const base = Number(params.base);
    const delta = Number(params.delta);
    const op = String(params.op ?? "+");
    return {
      strategy: op === "+" ? "Add 10 or 100" : "Subtract 10 or 100",
      strategySteps: [
        `Start at ${base}.`,
        op === "+"
          ? `Move up ${delta} on the hundred chart.`
          : `Move back ${delta} on the hundred chart.`,
        `Think: ${base} ${op} ${delta} = ?`,
      ],
    };
  }
  return null;
}

function measurementNudge(params: ActivityParams): QuestionNudge | null {
  const length = params.length;
  const object = String(params.object ?? "object");
  const tool = String(params.tool ?? "ruler");
  return {
    strategy: "Measure & record",
    strategySteps: [
      `Use a ${tool} to measure the ${object}.`,
      "Line up zero with the end of the object.",
      `How many ${params.unit ?? "units"} long is it?`,
      typeof length === "number" ? `Check: is it close to ${length}?` : "Type the length you find.",
    ],
  };
}

function timeMoneyNudge(params: ActivityParams): QuestionNudge | null {
  if (params.coins) {
    return {
      strategy: "Count coins left to right",
      strategySteps: [
        `Coins: ${params.coins}.`,
        "Count quarters (25), then dimes (10), nickels (5), pennies (1).",
        "Add the values step by step.",
      ],
    };
  }
  if (params.time) {
    return {
      strategy: "Read the clock",
      strategySteps: [
        `Find the hour hand. It points near ${String(params.time).split(":")[0]}.`,
        "Find the minute hand. Each number is 5 minutes.",
        `Write the time as hour:minutes (e.g. ${params.time}).`,
      ],
    };
  }
  return null;
}

function dataChartNudge(params: ActivityParams): QuestionNudge | null {
  const categories = params.categories as string[] | undefined;
  const counts = params.counts as number[] | undefined;
  const question = String(params.question ?? "");
  if (categories && counts) {
    const pairs = categories.map((c, i) => `${c}: ${counts[i]}`).join(", ");
    return {
      strategy: "Use the chart data",
      strategySteps: [
        `Data: ${pairs}.`,
        `Question: ${question}`,
        "Subtract to find 'how many more' or add for 'in all'.",
      ],
    };
  }
  return null;
}

function geometryNudge(params: ActivityParams): QuestionNudge | null {
  if (params.answer && params.parts) {
    return {
      strategy: "Name equal shares",
      strategySteps: [
        `Shape split into ${params.parts} equal parts.`,
        "Each part is one __ of the whole.",
        "Halves = 2, thirds = 3, fourths = 4.",
      ],
    };
  }
  const shape = String(params.shape ?? "shape");
  const sides = params.sides;
  return {
    strategy: "Count sides & corners",
    strategySteps: [
      `Draw a ${shape}.`,
      typeof sides === "number" ? `This shape has ${sides} sides.` : "Count each side carefully.",
      "Name the shape when you know its sides.",
    ],
  };
}

function readingNudge(params: ActivityParams): QuestionNudge | null {
  const passage = String(params.passage ?? "");
  const question = String(params.question ?? "");
  const answer = String(params.answer ?? "");
  if (!passage || !question) return null;

  const q = question.toLowerCase();
  const snippet = firstSentence(passage);
  let strategy = "Read the clue sentence";
  const steps: string[] = [`Slow read: "${snippet}."`];

  if (q.startsWith("who")) {
    strategy = "Questioning · WHO: find the name";
    steps.push("Look for a person or animal that does the action.");
    steps.push("The who is usually the subject of the sentence.");
  } else if (q.startsWith("where")) {
    strategy = "WHERE: find the place";
    steps.push("Hunt for place words: park, lake, under, near…");
  } else if (q.startsWith("when")) {
    strategy = "WHEN: find the time";
    steps.push("Look for time words: noon, morning, first, then…");
  } else if (q.startsWith("what") && q.includes("lesson")) {
    strategy = "WHAT: the lesson or moral";
    steps.push("Ask: What did the character learn?");
    steps.push("Say the lesson in one short sentence.");
  } else if (q.startsWith("what")) {
    strategy = "WHAT: the key detail";
    steps.push("Find the sentence that answers the question.");
  } else if (q.startsWith("how")) {
    strategy = "HOW: the way it happened";
    steps.push("Look for action words that show how someone responded.");
  } else if (q.startsWith("why")) {
    strategy = "WHY: the reason";
    steps.push("Find because, so, or the reason in the text.");
  } else {
    steps.push(`Question focus: ${question}`);
  }

  if (answer) {
    steps.push(`Your answer should mention something like: "${answer.split(" ")[0]}…"`);
  }

  return { strategy, strategySteps: steps };
}

function scienceNudge(_params: ActivityParams): QuestionNudge | null {
  return null;
}

function languageEditNudge(params: ActivityParams): QuestionNudge | null {
  const sentence = String(params.sentence ?? "");
  return {
    strategy: "Fix conventions",
    strategySteps: [
      `Read aloud: "${sentence}"`,
      "Capitalize the first word and any names.",
      "Add ending punctuation (. ? !) and fix spelling.",
    ],
  };
}

function writingFrameNudge(params: ActivityParams): QuestionNudge | null {
  const parts = (params.requiredParts as string[]) ?? [];
  const frame = String(params.frame ?? "writing");
  return {
    strategy: frame === "narrative" ? "Tell the story" : "Inform the reader",
    strategySteps: [
      String(params.prompt),
      ...parts.map((p) => `Fill in "${p}" with one clear sentence.`),
    ],
  };
}

function checklistNudge(params: ActivityParams): QuestionNudge | null {
  const items = (params.items as string[]) ?? [];
  if (items.length === 0) return null;
  return {
    strategy: "Do the step, then check",
    strategySteps: [
      `Today's step: ${items[0]}`,
      "Try it for real. Talk, read, write, or practice.",
      "Check the box when you truly finished.",
    ],
  };
}
