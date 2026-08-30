import { findStandard, listGrade2Standards } from "../standards";
import { isShowcaseLab, labIdFromStandardActivity } from "../../boards";
import type { ActivityParams } from "../activities";
import { generateMathQuestion } from "../generators/math";
import { generateElaQuestion } from "../generators/ela";
import { generateScienceQuestion } from "../generators/science";
import { enrichParamsWithStrategy } from "../curriculumStrategies";
import {
  GENERIC_FALLBACK_MARKERS,
  QUESTIONS_PER_STANDARD,
  type QuestionSet,
} from "./types";

const SHOWCASE_CODES = new Set(["NC.2.NBT.1", "W.2.1", "2.P.2.1"]);

function enrichSet(standardCode: string, questions: ActivityParams[]): ActivityParams[] {
  const standard = findStandard(standardCode);
  if (!standard) return questions;
  return questions.map((q) => enrichParamsWithStrategy(standardCode, standard.activityType, q));
}

function buildMathSet(standardCode: string): ActivityParams[] {
  const standard = findStandard(standardCode);
  if (!standard) return [];
  return enrichSet(
    standardCode,
    Array.from({ length: QUESTIONS_PER_STANDARD }, (_, seed) => generateMathQuestion(standard, seed)),
  );
}

function buildElaSet(standardCode: string): ActivityParams[] {
  const questions = Array.from({ length: QUESTIONS_PER_STANDARD }, (_, seed) =>
    generateElaQuestion(standardCode, seed),
  ).filter((q): q is ActivityParams => q !== null);
  if (questions.length === 0) return [];
  return enrichSet(standardCode, questions);
}

function buildScienceSet(standardCode: string): ActivityParams[] {
  const questions = Array.from({ length: QUESTIONS_PER_STANDARD }, (_, seed) =>
    generateScienceQuestion(standardCode, seed),
  ).filter((q): q is ActivityParams => q !== null);
  if (questions.length === 0) return [];
  return enrichSet(standardCode, questions);
}

export function getQuestionSet(standardCode: string): ActivityParams[] {
  if (SHOWCASE_CODES.has(standardCode)) {
    return [];
  }

  const standard = findStandard(standardCode);
  if (!standard) return [];

  const labId = labIdFromStandardActivity(standard.activityType);
  if (!labId || isShowcaseLab(labId)) return [];

  if (standard.subject === "math") return buildMathSet(standardCode);
  if (standard.subject === "ela") return buildElaSet(standardCode);
  if (standard.subject === "science") return buildScienceSet(standardCode);
  return [];
}

export function isQuestionSetStandard(standardCode: string): boolean {
  return getQuestionSet(standardCode).length === QUESTIONS_PER_STANDARD;
}

export function validateQuestionSets(): string[] {
  const errors: string[] = [];
  const playable = listGrade2Standards().filter((s) => !SHOWCASE_CODES.has(s.code));

  for (const standard of playable) {
    const questions = getQuestionSet(standard.code);

    if (questions.length !== QUESTIONS_PER_STANDARD) {
      errors.push(`${standard.code}: expected ${QUESTIONS_PER_STANDARD} questions, got ${questions.length}`);
      continue;
    }

    const serialized = questions.map((q) => JSON.stringify(q));
    if (new Set(serialized).size !== questions.length) {
      errors.push(`${standard.code}: duplicate questions in set`);
    }

    for (const q of questions) {
      const blob = JSON.stringify(q);
      for (const marker of GENERIC_FALLBACK_MARKERS) {
        if (blob.includes(marker)) {
          errors.push(`${standard.code}: contains generic fallback "${marker}"`);
        }
      }
      if (typeof q.strategy !== "string" || !Array.isArray(q.strategySteps) || q.strategySteps.length === 0) {
        errors.push(`${standard.code}: missing curriculum strategy on a question`);
      }
      if (
        !q.strategySource ||
        typeof q.strategySource !== "object" ||
        typeof (q.strategySource as { label?: unknown }).label !== "string"
      ) {
        errors.push(`${standard.code}: missing official strategy source citation`);
      }
    }
  }

  return errors;
}

export function getQuestionSetMeta(standardCode: string): QuestionSet | null {
  const questions = getQuestionSet(standardCode);
  if (questions.length === 0) return null;
  return { standardCode, questions };
}

export { QUESTIONS_PER_STANDARD, QUESTIONS_TO_MASTER, SMART_SCORE_TARGET } from "./types";
