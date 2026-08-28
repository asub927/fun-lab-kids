import type { LabId } from "../types";
import { findStandard } from "./standards";

export type ActivityParams = Record<string, unknown>;

export function labIdFromActivityType(activityType: string): LabId | null {
  const map: Record<string, LabId> = {
    "showcase:place-value": "place-value",
    "showcase:opinion-builder": "opinion-builder",
    "showcase:matter-lab": "matter-lab",
    "word-problem": "word-problem",
    "numeric-flash": "numeric-flash",
    "equal-groups": "equal-groups",
    "number-sense": "number-sense",
    "computation": "computation",
    "measurement": "measurement",
    "time-money": "time-money",
    "data-chart": "data-chart",
    geometry: "geometry",
    "writing-frame": "writing-frame",
    "reading-response": "reading-response",
    "language-edit": "language-edit",
    checklist: "checklist",
    "science-inquiry": "science-inquiry",
  };
  return map[activityType] ?? null;
}

export function getActivityParams(standardCode: string): ActivityParams {
  const standard = findStandard(standardCode);
  if (!standard) return {};

  switch (standard.code) {
    case "NC.2.OA.1":
      return {
        story: "Jordan has 38 stickers. His friend gives him 25 more. How many stickers does Jordan have now?",
        answer: 63,
      };
    case "NC.2.MD.5":
      return {
        story: "A rope is 48 inches long. Maya cuts off 15 inches. How long is the rope now?",
        answer: 33,
        unit: "inches",
      };
    case "NC.2.OA.2":
      return { a: 8, b: 7, op: "+", answer: 15 };
    case "NC.2.NBT.5":
      return { a: 56, b: 28, op: "+", answer: 84 };
    case "NC.2.OA.3":
      return { count: 15, mode: "odd-even", answer: "odd" };
    case "NC.2.OA.4":
      return { rows: 3, cols: 4, answer: 12 };
    case "NC.2.NBT.2":
      return { mode: "skip-count", start: 100, step: 10, answer: 110 };
    case "NC.2.NBT.3":
      return { mode: "expanded", number: 352, answer: "300+50+2" };
    case "NC.2.NBT.4":
      return { mode: "compare", a: 418, b: 481, answer: "<" };
    case "NC.2.NBT.6":
      return { mode: "triple-add", values: [24, 35, 18], answer: 77 };
    case "NC.2.NBT.7":
      return { a: 456, b: 128, op: "+", answer: 584 };
    case "NC.2.NBT.8":
      return { base: 350, delta: 100, op: "+", answer: 450 };
    case "NC.2.MD.1":
      return { object: "pencil", tool: "ruler", length: 6, unit: "inches" };
    case "NC.2.MD.7":
      return { time: "3:25", answer: "3:25" };
    case "NC.2.MD.8":
      return { coins: "2 quarters, 1 dime", cents: 60 };
    case "NC.2.MD.10":
      return {
        categories: ["Red", "Blue", "Green"],
        counts: [4, 7, 3],
        question: "How many more Blue than Red?",
        answer: 3,
      };
    case "NC.2.G.1":
      return { shape: "hexagon", sides: 6 };
    case "NC.2.G.3":
      return { shape: "rectangle", parts: 4, answer: "fourths" };
    case "W.2.2":
      return {
        frame: "informative",
        prompt: "Write about how plants grow.",
        requiredParts: ["topic", "fact", "conclusion"],
      };
    case "W.2.3":
      return {
        frame: "narrative",
        prompt: "Tell about a time you learned something new.",
        requiredParts: ["event", "detail", "feeling"],
      };
    case "RI.2.2":
      return {
        passage: "Frogs live near water. They start as eggs, become tadpoles, then grow into adult frogs.",
        question: "What is the main topic?",
        answer: "frog life cycle",
      };
    case "L.2.1":
      return {
        sentence: "the dog ran fast",
        fixed: "The dog ran fast.",
      };
    case "2.P.1.1":
      return {
        scenario: "sound",
        prompt: "What vibrates to make a guitar string sound?",
        answer: "string",
      };
    case "2.E.1.2":
      return {
        scenario: "weather",
        prompt: "Which tool measures wind speed?",
        answer: "anemometer",
      };
    case "2.L.1.1":
      return {
        scenario: "lifecycle",
        stages: ["birth", "adult", "reproduce", "death"],
      };
    default:
      break;
  }

  const activityType = standard.activityType;

  if (activityType === "reading-response") {
    return {
      passage: "Read the standard and answer in your own words.",
      question: `How does this standard apply: ${standard.text.slice(0, 80)}…?`,
      answer: "student response",
    };
  }

  if (activityType === "writing-frame") {
    return {
      frame: "informative",
      prompt: standard.text,
      requiredParts: ["topic", "detail"],
    };
  }

  if (activityType === "language-edit") {
    return {
      sentence: "i like to read books",
      fixed: "I like to read books.",
    };
  }

  if (activityType === "checklist") {
    return {
      items: [
        "I read the learning goal.",
        "I tried the activity with my partner or agent.",
        "I can explain what I learned.",
      ],
    };
  }

  if (activityType === "science-inquiry") {
    return {
      scenario: "inquiry",
      prompt: standard.text,
      answer: "explored",
    };
  }

  if (activityType === "measurement") {
    return { object: "book", tool: "ruler", length: 10, unit: "inches" };
  }

  if (activityType === "time-money") {
    return { time: "2:15", answer: "2:15" };
  }

  if (activityType === "number-sense") {
    return { mode: "compare", a: 245, b: 254, answer: "<" };
  }

  if (activityType === "computation") {
    return { a: 34, b: 22, op: "+", answer: 56 };
  }

  if (activityType === "equal-groups") {
    return { rows: 2, cols: 5, answer: 10 };
  }

  if (activityType === "geometry") {
    return { shape: "triangle", sides: 3 };
  }

  return { prompt: standard.text };
}

export function resolveLabForStandard(standardCode: string): {
  labId: LabId;
  params: ActivityParams;
} | null {
  const standard = findStandard(standardCode);
  if (!standard) return null;
  const labId = labIdFromActivityType(standard.activityType);
  if (!labId) return null;
  return { labId, params: getActivityParams(standardCode) };
}
