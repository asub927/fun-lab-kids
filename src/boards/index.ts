import type { BoardState, CheckResult, LabId } from "../types";
import {
  applyPlaceValueAction,
  checkPlaceValue,
  comparePlaceValues,
  createPlaceValueState,
} from "./placeValue";
import {
  applyOpinionAction,
  checkOpinion,
  createOpinionState,
  proposeRevision,
} from "./opinionBuilder";
import {
  applyMatterAction,
  checkMatter,
  createMatterState,
} from "./matterLab";
import {
  applyTemplateAction,
  checkTemplate,
  createTemplateState,
  templateHint,
} from "./templates";
import type { ActivityParams } from "../data/activities";

const SHOWCASE_LABS: LabId[] = ["place-value", "opinion-builder", "matter-lab"];

function isTemplateLab(labId: LabId): labId is Exclude<LabId, "place-value" | "opinion-builder" | "matter-lab"> {
  return !SHOWCASE_LABS.includes(labId);
}

export function createBoardState(
  labId: LabId,
  options?: { standardCode?: string; params?: ActivityParams },
): BoardState {
  switch (labId) {
    case "place-value":
      return createPlaceValueState(
        typeof options?.params?.targetNumber === "number"
          ? options.params.targetNumber
          : 243,
      );
    case "opinion-builder":
      return createOpinionState();
    case "matter-lab":
      return createMatterState();
    default:
      return createTemplateState(
        labId,
        options?.standardCode ?? "",
        options?.params ?? {},
      );
  }
}

export function applyBoardAction(
  state: BoardState,
  action: Record<string, unknown>,
): BoardState {
  if (state.labId === "place-value") return applyPlaceValueAction(state, action);
  if (state.labId === "opinion-builder") return applyOpinionAction(state, action);
  if (state.labId === "matter-lab") return applyMatterAction(state, action);
  return applyTemplateAction(state, action);
}

export function runBoardCheck(state: BoardState): CheckResult {
  if (state.labId === "place-value") return checkPlaceValue(state);
  if (state.labId === "opinion-builder") return checkOpinion(state);
  if (state.labId === "matter-lab") return checkMatter(state);
  return checkTemplate(state);
}

export function labHint(state: BoardState | null): string {
  if (!state) return "Pick a lab to begin.";
  if (state.labId === "place-value")
    return "Use hundreds, tens, and ones blocks. Group ten ones into a ten.";
  if (state.labId === "opinion-builder")
    return "Add a topic, your opinion, two reasons, and a linking word like because.";
  if (state.labId === "matter-lab")
    return "Classify each object, heat above 0°C, predict ice becomes liquid.";
  return templateHint(state);
}

export function labIdFromStandardActivity(activityType: string): LabId | null {
  const map: Record<string, LabId> = {
    "showcase:place-value": "place-value",
    "showcase:opinion-builder": "opinion-builder",
    "showcase:matter-lab": "matter-lab",
    "word-problem": "word-problem",
    "numeric-flash": "numeric-flash",
    "equal-groups": "equal-groups",
    "number-sense": "number-sense",
    computation: "computation",
    measurement: "measurement",
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

export function isShowcaseLab(labId: LabId): boolean {
  return SHOWCASE_LABS.includes(labId);
}

export function isTemplateLabId(labId: LabId): boolean {
  return isTemplateLab(labId);
}

export { proposeRevision, comparePlaceValues };
