import { g2MathStandards } from "./standards/g2-math";
import { g2ElaStandards } from "./standards/g2-ela";
import { g2ScienceStandards } from "./standards/g2-science";
import type { Standard } from "../types";

export const grade2Standards: Standard[] = [
  ...g2MathStandards,
  ...g2ElaStandards,
  ...g2ScienceStandards,
];

/** Legacy showcase alias for judges / deep links */
export const grade2ShowcaseStandards: Standard[] = grade2Standards.filter((s) =>
  s.activityType.startsWith("showcase:"),
);

/** Phase 2+ catalog stubs (non–Grade 2) */
const futureStandards: Standard[] = [
  {
    code: "NC.3.NF.1",
    subject: "math",
    grade: 3,
    strand: "Number and Operations—Fractions",
    text: "Interpret unit fractions with numerators of 1 and denominators of 2, 3, 4, 6, and 8.",
    activityType: "coming-soon",
    source: "NCSCOS Mathematics 2017",
  },
  {
    code: "W.3.1",
    subject: "ela",
    grade: 3,
    strand: "Writing",
    text: "Write opinion pieces on topics or texts, supporting a point of view with reasons.",
    activityType: "coming-soon",
    source: "NCSCOS English Language Arts 2017",
  },
  {
    code: "PS.3.1",
    subject: "science",
    grade: 3,
    strand: "Matter and Its Interactions",
    text: "Understand properties of solids, liquids, and gases.",
    activityType: "coming-soon",
    source: "NCSCOS Science",
  },
  {
    code: "NC.K.CC.1",
    subject: "math",
    grade: 0,
    strand: "Counting and Cardinality",
    text: "Know number names and the counting sequence.",
    activityType: "coming-soon",
    source: "NCSCOS Mathematics 2017",
  },
];

export const allStandards: Standard[] = [...grade2Standards, ...futureStandards];

export function findStandard(code: string): Standard | undefined {
  return allStandards.find((s) => s.code === code);
}

export function listStandards(filters?: {
  subject?: Standard["subject"];
  grade?: Standard["grade"];
}): Standard[] {
  return allStandards.filter((s) => {
    if (filters?.subject && s.subject !== filters.subject) return false;
    if (filters?.grade !== undefined && s.grade !== filters.grade) return false;
    return true;
  });
}

export function listGrade2Standards(subject?: Standard["subject"]): Standard[] {
  return listStandards({ grade: 2, ...(subject ? { subject } : {}) });
}

export function isPlayable(standard: Standard): boolean {
  return standard.grade === 2 && standard.activityType !== "coming-soon";
}

export { g2MathStandards, g2ElaStandards, g2ScienceStandards };
