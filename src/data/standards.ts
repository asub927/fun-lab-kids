import type { Standard } from "../types";

export const grade2ShowcaseStandards: Standard[] = [
  {
    code: "NC.2.NBT.1",
    subject: "math",
    grade: 2,
    strand: "Number and Operations in Base Ten",
    text: "Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones.",
    activityType: "showcase:place-value",
    source: "NCSCOS Mathematics 2017",
    sourceUrl: "https://www.dpi.nc.gov/districts-schools/classroom-resources/office-teaching-and-learning/standard-course-study/mathematics",
  },
  {
    code: "W.2.1",
    subject: "ela",
    grade: 2,
    strand: "Writing",
    text: "Write opinion pieces in which they introduce the topic or book they are writing about, state an opinion, supply reasons that support the opinion, use linking words to connect opinion and reasons, and provide a concluding statement or section.",
    activityType: "showcase:opinion-builder",
    source: "NCSCOS English Language Arts 2017",
    sourceUrl: "https://www.dpi.nc.gov/districts-schools/classroom-resources/office-teaching-and-learning/standard-course-study",
  },
  {
    code: "PS.2.1",
    subject: "science",
    grade: 2,
    strand: "Matter and Its Interactions",
    text: "Understand properties of solids and liquids and the changes they undergo.",
    activityType: "showcase:matter-lab",
    source: "NCSCOS Science",
    sourceUrl: "https://www.dpi.nc.gov/districts-schools/classroom-resources/office-teaching-and-learning/standard-course-study",
  },
];

export const grade2Standards: Standard[] = [
  ...grade2ShowcaseStandards,
  {
    code: "NC.2.OA.1",
    subject: "math",
    grade: 2,
    strand: "Operations and Algebraic Thinking",
    text: "Represent and solve addition and subtraction word problems, within 100, with unknowns in all positions.",
    activityType: "word_problem",
    source: "NCSCOS Mathematics 2017",
  },
  {
    code: "RI.2.2",
    subject: "ela",
    grade: 2,
    strand: "Reading Informational Text",
    text: "Identify the main topic of a multi-paragraph text as well as the focus of specific paragraphs within the text.",
    activityType: "main_idea_highlight",
    source: "NCSCOS English Language Arts 2017",
  },
  {
    code: "ESS.2.1",
    subject: "science",
    grade: 2,
    strand: "Earth's Systems",
    text: "Understand patterns of weather and factors that affect weather.",
    activityType: "observe_record",
    source: "NCSCOS Science",
  },
];

export const allStandards: Standard[] = [
  ...grade2Standards,
  {
    code: "NC.3.NF.1",
    subject: "math",
    grade: 3,
    strand: "Number and Operations—Fractions",
    text: "Interpret unit fractions with numerators of 1 and denominators of 2, 3, 4, 6, and 8.",
    activityType: "fraction_bars",
    source: "NCSCOS Mathematics 2017",
  },
  {
    code: "W.3.1",
    subject: "ela",
    grade: 3,
    strand: "Writing",
    text: "Write opinion pieces on topics or texts, supporting a point of view with reasons.",
    activityType: "revise_replace",
    source: "NCSCOS English Language Arts 2017",
  },
  {
    code: "PS.3.1",
    subject: "science",
    grade: 3,
    strand: "Matter and Its Interactions",
    text: "Understand properties of solids, liquids, and gases.",
    activityType: "classify_sort",
    source: "NCSCOS Science",
  },
  {
    code: "NC.K.CC.1",
    subject: "math",
    grade: 0,
    strand: "Counting and Cardinality",
    text: "Know number names and the counting sequence.",
    activityType: "skip_count_line",
    source: "NCSCOS Mathematics 2017",
  },
];

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
