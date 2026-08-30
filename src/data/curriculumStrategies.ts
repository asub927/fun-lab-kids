import type { ActivityParams } from "./activities";
import { questionSpecificStrategy } from "./questionNudges";
import { getVideoForStandard, type VideoReference } from "./videoReferences";
import { ELA_STRATEGIES } from "./strategies/elaStrategies";
import { MATH_STANDARD_OVERRIDES, MATH_STRATEGIES } from "./strategies/mathStrategies";
import { SCIENCE_STRATEGIES } from "./strategies/scienceStrategies";
import type { CurriculumStrategy } from "./strategies/types";

export type { StrategySource } from "./strategySources";
export type { CurriculumStrategy } from "./strategies/types";

export type EnrichedQuestionParams = ActivityParams & {
  strategy?: string;
  strategySteps?: string[];
  strategySource?: { label: string; url: string };
  videoUrl?: string;
  videoTitle?: string;
  videoProvider?: string;
};

function resolveBaseStrategy(standardCode: string, activityType: string): CurriculumStrategy | null {
  if (ELA_STRATEGIES[standardCode]) return ELA_STRATEGIES[standardCode];
  if (MATH_STANDARD_OVERRIDES[standardCode]) return MATH_STANDARD_OVERRIDES[standardCode];
  if (SCIENCE_STRATEGIES[standardCode]) return SCIENCE_STRATEGIES[standardCode];
  if (activityType.startsWith("showcase:")) return null;
  if (MATH_STRATEGIES[activityType]) return MATH_STRATEGIES[activityType];
  return null;
}

export function resolveCurriculumStrategy(
  standardCode: string,
  activityType: string,
  params: ActivityParams,
): CurriculumStrategy | null {
  const base = resolveBaseStrategy(standardCode, activityType);
  const specific = questionSpecificStrategy(activityType, params);

  if (specific && base) {
    return {
      ...specific,
      strategySource: base.strategySource,
    };
  }

  return base;
}

function attachVideo(standardCode: string, activityType: string): VideoReference | null {
  return getVideoForStandard(standardCode, activityType);
}

export function enrichParamsWithStrategy(
  standardCode: string,
  activityType: string,
  params: ActivityParams,
): EnrichedQuestionParams {
  const resolved = resolveCurriculumStrategy(standardCode, activityType, params);
  const video = attachVideo(standardCode, activityType);

  return {
    ...params,
    ...(resolved
      ? {
          strategy: resolved.strategy,
          strategySteps: resolved.strategySteps,
          strategySource: resolved.strategySource,
        }
      : {}),
    ...(video
      ? {
          videoUrl: video.videoUrl,
          videoTitle: video.videoTitle,
          videoProvider: video.videoProvider,
        }
      : {}),
  };
}
