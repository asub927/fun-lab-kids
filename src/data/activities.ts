import type { LabId } from "../types";
import { findStandard } from "./standards";
import { getQuestionSet } from "./questionSets";

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

/** @deprecated Use getQuestionSet — returns first question params for compat */
export function getActivityParams(standardCode: string): ActivityParams {
  const set = getQuestionSet(standardCode);
  if (set.length > 0) return set[0];

  const standard = findStandard(standardCode);
  if (!standard) return {};
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

  const questionSet = getQuestionSet(standardCode);
  const params = questionSet[0] ?? getActivityParams(standardCode);
  return { labId, params };
}

export { getQuestionSet };
