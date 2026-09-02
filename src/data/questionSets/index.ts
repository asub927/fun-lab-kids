import { findStandard, listGrade2Standards } from "../standards";
import { isShowcaseLab, labIdFromStandardActivity } from "../../boards";
import type { ActivityParams } from "../activities";
import { generateMathQuestion } from "../generators/math";
import { generateElaQuestion } from "../generators/ela";
import { generateScienceQuestion } from "../generators/science";
import { enrichParamsWithStrategy } from "../curriculumStrategies";
import {
  GENERIC_FALLBACK_MARKERS,
  QUESTION_POOL_SIZE,
  QUESTIONS_PER_STANDARD,
  type QuestionSet,
} from "./types";

const SHOWCASE_CODES = new Set(["NC.2.NBT.1", "W.2.1", "2.P.2.1"]);

function enrichSet(standardCode: string, questions: ActivityParams[]): ActivityParams[] {
  const standard = findStandard(standardCode);
  if (!standard) return questions;
  return questions.map((q) => enrichParamsWithStrategy(standardCode, standard.activityType, q));
}

function buildMathPool(standardCode: string): ActivityParams[] {
  const standard = findStandard(standardCode);
  if (!standard) return [];
  return enrichSet(
    standardCode,
    Array.from({ length: QUESTION_POOL_SIZE }, (_, seed) => generateMathQuestion(standard, seed)),
  );
}

function buildElaPool(standardCode: string): ActivityParams[] {
  const questions = Array.from({ length: QUESTION_POOL_SIZE }, (_, seed) =>
    generateElaQuestion(standardCode, seed),
  ).filter((q): q is ActivityParams => q !== null);
  if (questions.length === 0) return [];
  return enrichSet(standardCode, questions);
}

function buildSciencePool(standardCode: string): ActivityParams[] {
  const questions = Array.from({ length: QUESTION_POOL_SIZE }, (_, seed) =>
    generateScienceQuestion(standardCode, seed),
  ).filter((q): q is ActivityParams => q !== null);
  if (questions.length === 0) return [];
  return enrichSet(standardCode, questions);
}

export function getQuestionPool(standardCode: string): ActivityParams[] {
  if (SHOWCASE_CODES.has(standardCode)) {
    return [];
  }

  const standard = findStandard(standardCode);
  if (!standard) return [];

  const labId = labIdFromStandardActivity(standard.activityType);
  if (!labId || isShowcaseLab(labId)) return [];

  if (standard.subject === "math") return buildMathPool(standardCode);
  if (standard.subject === "ela") return buildElaPool(standardCode);
  if (standard.subject === "science") return buildSciencePool(standardCode);
  return [];
}

function slicePool(pool: ActivityParams[], visitIndex = 0): ActivityParams[] {
  if (pool.length === 0) return [];
  const start = (Math.max(0, visitIndex) * QUESTIONS_PER_STANDARD) % pool.length;
  return pool.slice(start, start + QUESTIONS_PER_STANDARD);
}

export function getQuestionSet(standardCode: string, visitIndex = 0): ActivityParams[] {
  return slicePool(getQuestionPool(standardCode), visitIndex);
}

export function isQuestionSetStandard(standardCode: string): boolean {
  return getQuestionPool(standardCode).length === QUESTION_POOL_SIZE;
}

export function validateQuestionSets(): string[] {
  const errors: string[] = [];
  const playable = listGrade2Standards().filter((s) => !SHOWCASE_CODES.has(s.code));

  for (const standard of playable) {
    const pool = getQuestionPool(standard.code);

    if (pool.length !== QUESTION_POOL_SIZE) {
      errors.push(`${standard.code}: expected pool of ${QUESTION_POOL_SIZE}, got ${pool.length}`);
      continue;
    }

    const serialized = pool.map((q) => JSON.stringify(q));
    if (new Set(serialized).size !== pool.length) {
      errors.push(`${standard.code}: duplicate questions in pool`);
    }

    for (let visit = 0; visit < QUESTION_POOL_SIZE / QUESTIONS_PER_STANDARD; visit++) {
      const session = slicePool(pool, visit);
      if (session.length !== QUESTIONS_PER_STANDARD) {
        errors.push(`${standard.code}: visit ${visit} expected ${QUESTIONS_PER_STANDARD}, got ${session.length}`);
      }
    }

    for (const q of pool) {
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

export {
  QUESTION_POOL_SIZE,
  QUESTIONS_PER_STANDARD,
  QUESTIONS_TO_MASTER,
  SMART_SCORE_TARGET,
} from "./types";
