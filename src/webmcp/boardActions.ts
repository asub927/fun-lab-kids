import type { LabId } from "../types";

export type BoardActionSpec = {
  action: string;
  description: string;
  required?: string[];
  fields?: Record<string, string>;
  spoiler?: boolean;
  humanConfirmOnly?: boolean;
};

const PLACE_VALUE_ACTIONS: BoardActionSpec[] = [
  {
    action: "place_block",
    description: "Add one hundreds, tens, or ones block",
    required: ["block"],
    fields: { block: "hundred | ten | one" },
  },
  { action: "group_by_tens", description: "Group ten ones into one ten" },
  {
    action: "compose_number",
    description: "Instantly build a number with blocks (spoiler — prefer reveal_solution)",
    required: ["value"],
    fields: { value: "0-999" },
    spoiler: true,
    humanConfirmOnly: true,
  },
  { action: "decompose_number", description: "Rebuild current board value as H/T/O blocks" },
  {
    action: "compare_values",
    description: "Compare the board value with another number",
    required: ["other"],
    fields: { other: "number" },
  },
];

const OPINION_ACTIONS: BoardActionSpec[] = [
  {
    action: "place_sentence_part",
    description: "Set topic, opinion, reason, or linking text",
    required: ["part", "text"],
    fields: { part: "topic | opinion | reason | linking", text: "string" },
  },
  {
    action: "add_reason",
    description: "Add a reason sentence",
    required: ["text"],
    fields: { text: "string" },
  },
  {
    action: "insert_linking_word",
    description: "Add a linking word (because, also, for example, …)",
    required: ["word"],
    fields: { word: "string" },
  },
  {
    action: "read_aloud_preview",
    description: "Build a read-aloud preview of the opinion paragraph",
  },
  {
    action: "accept_revision",
    description: "Accept pending revision (child must confirm in UI)",
    humanConfirmOnly: true,
  },
  {
    action: "reject_revision",
    description: "Reject pending revision (child must confirm in UI)",
    humanConfirmOnly: true,
  },
];

const MATTER_ACTIONS: BoardActionSpec[] = [
  {
    action: "classify_object",
    description: "Classify an object as solid or liquid",
    required: ["objectId", "classification"],
    fields: { objectId: "ice | water | rock | juice", classification: "solid | liquid" },
  },
  {
    action: "set_temperature",
    description: "Set lab temperature in Celsius",
    required: ["celsius"],
    fields: { celsius: "-20..100" },
  },
  { action: "run_state_change", description: "Apply heating/cooling state change" },
  {
    action: "add_observation",
    description: "Add a science observation note",
    required: ["text"],
    fields: { text: "string" },
  },
  {
    action: "predict_state",
    description: "Predict ice state after temperature change",
    required: ["state"],
    fields: { state: "solid | liquid" },
  },
];

const TEMPLATE_ACTIONS: BoardActionSpec[] = [
  {
    action: "set_text",
    description: "Set free-text answer",
    required: ["text"],
    fields: { text: "string" },
  },
  {
    action: "set_numeric",
    description: "Set numeric answer",
    required: ["value"],
    fields: { value: "string or number" },
  },
  {
    action: "set_option",
    description: "Choose a multiple-choice option",
    required: ["value"],
    fields: { value: "option id or label" },
  },
  {
    action: "toggle_check",
    description: "Toggle a checklist item",
    required: ["index"],
    fields: { index: "0-based checklist index" },
  },
  {
    action: "set_frame_field",
    description: "Fill a writing-frame field",
    required: ["field", "text"],
    fields: { field: "field key", text: "string" },
  },
];

const LAB_GOALS: Record<LabId, string> = {
  "place-value": "Build the target number with hundreds, tens, and ones blocks.",
  "opinion-builder": "Write an opinion with topic, opinion, two reasons, and a linking word.",
  "matter-lab": "Classify matter, change temperature, predict and run the ice state change.",
  "word-problem": "Solve the word problem and enter your answer.",
  "numeric-flash": "Solve the quick number problem.",
  "equal-groups": "Make equal groups or arrays to find the total.",
  "number-sense": "Show number sense with place value or comparisons.",
  computation: "Compute the answer carefully.",
  measurement: "Measure, estimate, or compare lengths.",
  "time-money": "Solve the time or money problem.",
  "data-chart": "Read the chart and answer the question.",
  geometry: "Identify or reason about shapes.",
  "writing-frame": "Fill the writing frame fields.",
  "reading-response": "Respond to the reading passage.",
  "language-edit": "Fix or improve the language.",
  checklist: "Complete the checklist items.",
  "science-inquiry": "Investigate and answer the science prompt.",
};

export function listBoardActionsForLab(labId: LabId | null): BoardActionSpec[] {
  if (!labId) return [];
  if (labId === "place-value") return PLACE_VALUE_ACTIONS;
  if (labId === "opinion-builder") return OPINION_ACTIONS;
  if (labId === "matter-lab") return MATTER_ACTIONS;
  return TEMPLATE_ACTIONS;
}

export function getLabGoal(labId: LabId | null): string {
  if (!labId) return "No active lab.";
  return LAB_GOALS[labId] ?? "Complete the lab challenge.";
}

export const HUMAN_CONFIRM_ACTIONS = new Set([
  "compose_number",
  "accept_revision",
  "reject_revision",
]);
