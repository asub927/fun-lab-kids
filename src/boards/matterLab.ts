import type { CheckResult, MatterState } from "../types";

const DEFAULT_OBJECTS = [
  { id: "ice", name: "Ice cube", state: "solid" as const },
  { id: "water", name: "Water", state: "liquid" as const },
  { id: "rock", name: "Rock", state: "solid" as const },
  { id: "juice", name: "Juice", state: "liquid" as const },
];

export function createMatterState(): MatterState {
  return {
    labId: "matter-lab",
    objects: DEFAULT_OBJECTS.map((o) => ({ ...o })),
    classifications: {},
    temperatureC: 20,
    prediction: null,
    observations: [],
  };
}

function stateAtTemp(objectId: string, temp: number): "solid" | "liquid" {
  if (objectId === "ice") return temp < 0 ? "solid" : "liquid";
  if (objectId === "water" || objectId === "juice") return temp < 0 ? "solid" : "liquid";
  return "solid";
}

export function applyMatterAction(
  state: MatterState,
  action: Record<string, unknown>,
): MatterState {
  switch (action.action) {
    case "classify_object": {
      const objectId = String(action.objectId);
      const classification = action.classification as "solid" | "liquid";
      if (!["solid", "liquid"].includes(classification)) return state;
      return {
        ...state,
        classifications: { ...state.classifications, [objectId]: classification },
      };
    }
    case "set_temperature": {
      const celsius = Number(action.celsius);
      if (!Number.isFinite(celsius)) return state;
      return { ...state, temperatureC: Math.max(-20, Math.min(100, celsius)) };
    }
    case "run_state_change": {
      const obs = state.objects.map((o) => {
        const newState = stateAtTemp(o.id, state.temperatureC);
        return `${o.name} is now a ${newState} at ${state.temperatureC}°C.`;
      });
      return {
        ...state,
        observations: [...state.observations, ...obs],
        objects: state.objects.map((o) => ({
          ...o,
          state: stateAtTemp(o.id, state.temperatureC),
        })),
      };
    }
    case "add_observation": {
      const text = String(action.text ?? "").trim();
      if (!text) return state;
      return { ...state, observations: [...state.observations, text] };
    }
    case "predict_state": {
      const predicted = action.state as "solid" | "liquid";
      if (!["solid", "liquid"].includes(predicted)) return state;
      return { ...state, prediction: predicted };
    }
    default:
      return state;
  }
}

export function checkMatter(state: MatterState): CheckResult {
  const expected: Record<string, "solid" | "liquid"> = {
    ice: "solid",
    water: "liquid",
    rock: "solid",
    juice: "liquid",
  };

  const wrong = Object.entries(expected).filter(
    ([id, cls]) => state.classifications[id] !== cls,
  );

  if (wrong.length > 0) {
    return {
      ok: false,
      score: Math.max(0, 100 - wrong.length * 25),
      feedback: "Some objects are classified wrong. Solids keep their shape; liquids flow.",
    };
  }

  const iceState = state.objects.find((o) => o.id === "ice")?.state;
  if (state.temperatureC >= 0 && iceState === "liquid") {
    if (state.prediction !== "liquid") {
      return {
        ok: false,
        score: 60,
        feedback: "Ice melted! Predict liquid before or after heating, then run_check.",
      };
    }
    return {
      ok: true,
      score: 100,
      feedback: "You classified matter correctly and predicted the state change!",
    };
  }

  if (Object.keys(state.classifications).length < 4) {
    return {
      ok: false,
      score: 40,
      feedback: "Classify all four objects, then heat the ice and predict the change.",
    };
  }

  return {
    ok: true,
    score: 85,
    feedback: "Classifications look good! Heat the ice above 0°C and predict liquid to finish.",
  };
}

export function getIceStateAfterHeat(state: MatterState): "solid" | "liquid" {
  return state.temperatureC < 0 ? "solid" : "liquid";
}
