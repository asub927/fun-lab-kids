export type Subject = "math" | "ela" | "science";

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export type Standard = {
  code: string;
  subject: Subject;
  grade: Grade;
  strand: string;
  text: string;
  activityType: string;
  source: string;
  sourceUrl?: string;
};

export type ShowcaseLabId = "place-value" | "opinion-builder" | "matter-lab";

export type TemplateLabId =
  | "word-problem"
  | "numeric-flash"
  | "equal-groups"
  | "number-sense"
  | "computation"
  | "measurement"
  | "time-money"
  | "data-chart"
  | "geometry"
  | "writing-frame"
  | "reading-response"
  | "language-edit"
  | "checklist"
  | "science-inquiry";

export type LabId = ShowcaseLabId | TemplateLabId;

export type CheckResult = {
  ok: boolean;
  score: number;
  feedback: string;
  expectedHint?: string;
};

export type ToolCallLogEntry = {
  id: string;
  timestamp: number;
  tool: string;
  argsSummary: string;
  ok: boolean;
  message?: string;
};

export type BlockType = "hundred" | "ten" | "one";

export type PlaceValueState = {
  labId: "place-value";
  targetNumber: number;
  blocks: BlockType[];
};

export type SentencePart = "topic" | "opinion" | "reason" | "linking" | "closing";

export type OpinionState = {
  labId: "opinion-builder";
  topic: string;
  opinion: string;
  reasons: string[];
  linkingWords: string[];
  pendingRevision: string | null;
};

export type MatterObject = {
  id: string;
  name: string;
  state: "solid" | "liquid";
};

export type MatterState = {
  labId: "matter-lab";
  objects: MatterObject[];
  classifications: Record<string, "solid" | "liquid">;
  temperatureC: number;
  prediction: "solid" | "liquid" | null;
  observations: string[];
};

export type TemplateBoardState = {
  labId: TemplateLabId;
  standardCode: string;
  params: Record<string, unknown>;
  textResponse: string;
  numericAnswer: string;
  selectedOption: string;
  checklist: boolean[];
  frameFields: Record<string, string>;
};

export type BoardState =
  | PlaceValueState
  | OpinionState
  | MatterState
  | TemplateBoardState;

export type PlaceValueAction =
  | { action: "place_block"; block: BlockType }
  | { action: "group_by_tens" }
  | { action: "compose_number"; value: number }
  | { action: "decompose_number" }
  | { action: "compare_values"; other: number };

export type OpinionAction =
  | { action: "place_sentence_part"; part: SentencePart; text: string }
  | { action: "add_reason"; text: string }
  | { action: "insert_linking_word"; word: string }
  | { action: "read_aloud_preview" }
  | { action: "accept_revision" }
  | { action: "reject_revision" };

export type MatterAction =
  | { action: "classify_object"; objectId: string; classification: "solid" | "liquid" }
  | { action: "set_temperature"; celsius: number }
  | { action: "run_state_change" }
  | { action: "add_observation"; text: string }
  | { action: "predict_state"; state: "solid" | "liquid" };

export type TemplateAction =
  | { action: "set_text"; text: string }
  | { action: "set_numeric"; value: string }
  | { action: "set_option"; value: string }
  | { action: "toggle_check"; index: number }
  | { action: "set_frame_field"; field: string; text: string };

export type BoardAction = PlaceValueAction | OpinionAction | MatterAction | TemplateAction;

declare global {
  interface ModelContextTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: { readOnlyHint?: boolean };
    execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
  }

  interface ModelContext {
    registerTool(tool: ModelContextTool): Promise<void>;
    unregisterTool(name: string): Promise<void>;
  }

  interface Document {
    modelContext?: ModelContext;
  }
}

export {};
