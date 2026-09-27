import { FreshnessEvaluation } from '@messmind/shared-types';

export const MIN_ACCEPTABLE_FRESHNESS_SCORE = 65;

export const evaluateFreshnessSafety = (
  rawScore: number,
  shelfLifeHours: number,
  defectsSummary: string
): FreshnessEvaluation => {
  const boundedScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const isSafe = boundedScore >= MIN_ACCEPTABLE_FRESHNESS_SCORE && shelfLifeHours > 2;

  return {
    freshnessScore: boundedScore,
    estimatedRemainingShelfLifeHours: Math.max(0, shelfLifeHours),
    safetyFlag: isSafe,
    visualDefectsSummary: defectsSummary.trim() || 'No visible spoilage or thermal degradation detected',
    analyzedAt: new Date().toISOString(),
  };
};
