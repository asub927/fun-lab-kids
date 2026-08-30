import type { ActivityParams } from "../activities";

export type QuestionSet = {
  standardCode: string;
  questions: ActivityParams[];
};

/** Questions in one practice session (IXL-style progressive set). */
export const QUESTIONS_PER_STANDARD = 10;

/** Correct answers needed to master a standard in one session. */
export const QUESTIONS_TO_MASTER = 8;

/** Smart score target for mastery badge. */
export const SMART_SCORE_TARGET = 80;

export const GENERIC_FALLBACK_MARKERS = [
  "I read the learning goal.",
  "student response",
  "explored",
  "Read the standard and answer in your own words.",
  "I completed the activity.",
] as const;
