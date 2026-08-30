import type { StrategySource } from "../strategySources";

export type CurriculumStrategy = {
  strategy: string;
  strategySteps: string[];
  strategySource: StrategySource;
};

/** Per-question nudge without source — merged with base strategy in curriculumStrategies */
export type QuestionNudge = {
  strategy: string;
  strategySteps: string[];
};
