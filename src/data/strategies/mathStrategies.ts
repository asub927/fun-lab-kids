import { NC_MATH_G2, NC_SMP } from "../strategySources";
import type { CurriculumStrategy } from "./types";

/** NC SMP + Grade 2 Math Parent Guide strategies by lab activity type */
export const MATH_STRATEGIES: Record<string, CurriculumStrategy> = {
  "word-problem": {
    strategy: "SMP 1 & 4 · Make sense & model",
    strategySteps: [
      "Read the story. What is happening? What are you trying to find?",
      "Draw a number line or bar model to show the numbers.",
      "Write an equation. Solve and ask: Does my answer make sense?",
    ],
    strategySource: NC_MATH_G2,
  },
  "numeric-flash": {
    strategy: "SMP 8 · Mental math patterns",
    strategySteps: [
      "Look for doubles, near-doubles, or make-a-ten facts.",
      "Break numbers into tens and ones if that helps.",
      "Say the answer, then check with a quick draw or count.",
    ],
    strategySource: NC_SMP,
  },
  "computation": {
    strategy: "SMP 7 · Place value & structure",
    strategySteps: [
      "Line up hundreds, tens, and ones.",
      "Add or subtract by place value. Start with ones, then tens, then hundreds.",
      "Regroup when needed. Estimate first to check your answer.",
    ],
    strategySource: NC_MATH_G2,
  },
  "equal-groups": {
    strategy: "SMP 2 & 4 · Arrays & reasoning",
    strategySteps: [
      "Picture equal rows and columns (or pair objects for odd/even).",
      "Skip-count or add: rows × columns for arrays.",
      "For odd/even: every object paired? A leftover means odd.",
    ],
    strategySource: NC_SMP,
  },
  "number-sense": {
    strategy: "SMP 7 · Place value thinking",
    strategySteps: [
      "Use hundreds, tens, and ones blocks or a chart.",
      "Compare digits from left to right for >, <, or =.",
      "For skip-counting or +10/+100: notice the pattern in each place.",
    ],
    strategySource: NC_MATH_G2,
  },
  "measurement": {
    strategy: "SMP 5 · Use tools strategically",
    strategySteps: [
      "Pick the right tool (ruler, yardstick, or meter stick).",
      "Start measuring at zero, not the edge of the tool.",
      "Read to the nearest unit. For a number line, hop to add or subtract.",
    ],
    strategySource: NC_MATH_G2,
  },
  "time-money": {
    strategy: "SMP 6 · Attend to precision",
    strategySteps: [
      "Time: read the hour hand first, then minutes to the nearest five.",
      "Money: group coins from greatest to least value (quarters, dimes, nickels, pennies).",
      "Count on or skip-count to find the total cents.",
    ],
    strategySource: NC_MATH_G2,
  },
  "data-chart": {
    strategy: "SMP 4 · Interpret a representation",
    strategySteps: [
      "Read the category labels on the chart.",
      "Compare bar heights, tallies, or picture symbols.",
      "Answer how many, how many more, or how many in all.",
    ],
    strategySource: NC_SMP,
  },
  geometry: {
    strategy: "SMP 6 · Shapes & equal parts",
    strategySteps: [
      "Count sides and vertices to name the shape.",
      "For fractions: fold or draw equal shares (halves, thirds, fourths).",
      "Trace or sketch if it helps you see the parts.",
    ],
    strategySource: NC_SMP,
  },
};

/** Per-standard math overrides where NC emphasizes a specific tool */
export const MATH_STANDARD_OVERRIDES: Record<string, CurriculumStrategy> = {
  "NC.2.MD.5": {
    strategy: "SMP 4 · Length word problems",
    strategySteps: [
      "Draw a tape diagram or number line showing each length.",
      "Decide: are you putting lengths together or finding the difference?",
      "Write an equation in inches and check if the answer is reasonable.",
    ],
    strategySource: NC_MATH_G2,
  },
  "NC.2.MD.6": {
    strategy: "SMP 4 · Number line model",
    strategySteps: [
      "Draw a number line starting at 0 with equal spaces.",
      "Mark the starting number and hop forward or back.",
      "The landing spot is your sum or difference.",
    ],
    strategySource: NC_MATH_G2,
  },
  "NC.2.NBT.8": {
    strategy: "SMP 7 · +10 / +100 mentally",
    strategySteps: [
      "Find the hundreds, tens, and ones in the starting number.",
      "Adding 10 changes the tens digit; adding 100 changes the hundreds.",
      "Subtracting works the same way. Watch for regrouping.",
    ],
    strategySource: NC_MATH_G2,
  },
};
