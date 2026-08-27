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

export function createBoardState(labId: LabId): BoardState {
  switch (labId) {
    case "place-value":
      return createPlaceValueState(243);
    case "opinion-builder":
      return createOpinionState();
    case "matter-lab":
      return createMatterState();
  }
}

export function applyBoardAction(
  state: BoardState,
  action: Record<string, unknown>,
): BoardState {
  switch (state.labId) {
    case "place-value":
      return applyPlaceValueAction(state, action);
    case "opinion-builder":
      return applyOpinionAction(state, action);
    case "matter-lab":
      return applyMatterAction(state, action);
  }
}

export function runBoardCheck(state: BoardState): CheckResult {
  switch (state.labId) {
    case "place-value":
      return checkPlaceValue(state);
    case "opinion-builder":
      return checkOpinion(state);
    case "matter-lab":
      return checkMatter(state);
  }
}

export function labIdFromStandardActivity(activityType: string): LabId | null {
  if (activityType === "showcase:place-value") return "place-value";
  if (activityType === "showcase:opinion-builder") return "opinion-builder";
  if (activityType === "showcase:matter-lab") return "matter-lab";
  return null;
}

export { proposeRevision, comparePlaceValues };
