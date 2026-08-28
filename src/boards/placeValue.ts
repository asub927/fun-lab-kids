import type { BlockType, CheckResult, PlaceValueState } from "../types";

export function countBlocks(blocks: BlockType[]) {
  return {
    hundreds: blocks.filter((b) => b === "hundred").length,
    tens: blocks.filter((b) => b === "ten").length,
    ones: blocks.filter((b) => b === "one").length,
  };
}

export function blocksToValue(blocks: BlockType[]): number {
  const { hundreds, tens, ones } = countBlocks(blocks);
  return hundreds * 100 + tens * 10 + ones;
}

export function createPlaceValueState(targetNumber = 243): PlaceValueState {
  return {
    labId: "place-value",
    targetNumber,
    blocks: [],
  };
}

export function applyPlaceValueAction(
  state: PlaceValueState,
  action: Record<string, unknown>,
): PlaceValueState {
  switch (action.action) {
    case "place_block": {
      const block = action.block as BlockType;
      if (!["hundred", "ten", "one"].includes(block)) return state;
      return { ...state, blocks: [...state.blocks, block] };
    }
    case "group_by_tens": {
      const ones = state.blocks.filter((b) => b === "one");
      if (ones.length < 10) return state;
      const rest = state.blocks.filter((b) => b !== "one");
      const grouped: BlockType[] = [...rest];
      for (let i = 0; i < Math.floor(ones.length / 10); i++) grouped.push("ten");
      const leftoverOnes = ones.length % 10;
      for (let i = 0; i < leftoverOnes; i++) grouped.push("one");
      return { ...state, blocks: grouped };
    }
    case "compose_number": {
      const value = Number(action.value);
      if (!Number.isFinite(value) || value < 0 || value > 999) return state;
      const hundreds = Math.floor(value / 100);
      const tens = Math.floor((value % 100) / 10);
      const ones = value % 10;
      const blocks: BlockType[] = [
        ...Array(hundreds).fill("hundred" as BlockType),
        ...Array(tens).fill("ten" as BlockType),
        ...Array(ones).fill("one" as BlockType),
      ];
      return { ...state, blocks };
    }
    case "decompose_number": {
      return applyPlaceValueAction(state, {
        action: "compose_number",
        value: blocksToValue(state.blocks),
      });
    }
    case "compare_values": {
      return state;
    }
    default:
      return state;
  }
}

export function checkPlaceValue(state: PlaceValueState): CheckResult {
  const value = blocksToValue(state.blocks);
  const { hundreds, tens, ones } = countBlocks(state.blocks);
  const targetH = Math.floor(state.targetNumber / 100);
  const targetT = Math.floor((state.targetNumber % 100) / 10);
  const targetO = state.targetNumber % 10;

  if (value !== state.targetNumber) {
    return {
      ok: false,
      score: Math.max(0, 100 - Math.abs(value - state.targetNumber)),
      feedback: `Your board shows ${value}. Try to build ${state.targetNumber}.`,
      expectedHint: `${targetH} hundreds, ${targetT} tens, ${targetO} ones`,
    };
  }

  if (hundreds !== targetH || tens !== targetT || ones !== targetO) {
    return {
      ok: false,
      score: 50,
      feedback: "The total is right, but check your hundreds, tens, and ones counts.",
      expectedHint: `${targetH} hundreds, ${targetT} tens, ${targetO} ones`,
    };
  }

  return {
    ok: true,
    score: 100,
    feedback: `Great job! You built ${state.targetNumber} correctly.`,
  };
}

export function comparePlaceValues(state: PlaceValueState, other: number): CheckResult {
  const value = blocksToValue(state.blocks);
  const relation = value === other ? "equal to" : value > other ? "greater than" : "less than";
  return {
    ok: true,
    score: 100,
    feedback: `${value} is ${relation} ${other}.`,
  };
}
