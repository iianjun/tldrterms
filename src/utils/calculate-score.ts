import {
  CATEGORY_HIGH_NEGATIVE_THRESHOLD_PERCENT,
  CATEGORY_THRESHOLD,
  PP_CRITERION_WEIGHTS,
  TC_CRITERION_WEIGHTS,
  TC_CRITERION_WEIGHTS_WO_PAYMENT,
} from "@/constants/score";
import { AnalyticPoint, ScoreCategory } from "@/types/supabase";

interface AssessmentRes {
  score: number;
  category: ScoreCategory;
}

export function calculateScore({
  points,
  document_type,
}: {
  points: AnalyticPoint[];
  document_type: "terms" | "privacy";
}): AssessmentRes {
  const category = calculateScoreCategory(points);
  const score = calculatePercentageScore({
    points,
    document_type,
  });
  return { score, category };
}

function calculateScoreCategory(points: AnalyticPoint[]): ScoreCategory {
  const { required, optional } = points.reduce(
    (acc, point) => {
      acc.required += point.category === "payment" ? 0 : 1;
      acc.optional += point.category === "payment" && point.text_found ? 1 : 0;
      return acc;
    },
    { required: 0, optional: 0 }
  );
  const TOTAL_LENGTH = required + optional;
  const HIGH_NEGATIVE_THRESHOLD =
    TOTAL_LENGTH * CATEGORY_HIGH_NEGATIVE_THRESHOLD_PERCENT;

  const { totalScore, negativeCount, notFoundCount } = points.reduce(
    (acc, point) => {
      acc.totalScore += point.score;
      if (point.score < 0) acc.negativeCount += 1;
      if (!point.text_found && point.category !== "payment")
        acc.notFoundCount += 1;
      return acc;
    },
    { totalScore: 0, negativeCount: 0, notFoundCount: 0 }
  );

  const coverage = (TOTAL_LENGTH - notFoundCount) / TOTAL_LENGTH;
  const exceedNegThreshold = negativeCount >= HIGH_NEGATIVE_THRESHOLD;

  const maxPossibleScore = TOTAL_LENGTH * 2;
  const minPossibleScore = TOTAL_LENGTH * -2;
  const totalRange = maxPossibleScore - minPossibleScore;

  const normalizedScore = Math.max(
    0,
    Math.min(100, ((totalScore - minPossibleScore) / totalRange) * 100)
  );
  // low coverage
  if (coverage < CATEGORY_THRESHOLD.lowCoverage) {
    return "incomplete_potentially_risky";
  }
  if (exceedNegThreshold) {
    if (normalizedScore <= CATEGORY_THRESHOLD.harmful) {
      return "potentially_harmful";
    } else {
      return "concerning_major";
    }
  }
  if (normalizedScore >= CATEGORY_THRESHOLD.excellent) {
    return "excellent";
  } else if (normalizedScore >= CATEGORY_THRESHOLD.good) {
    return "good";
  } else if (normalizedScore > CATEGORY_THRESHOLD.concerningMinor) {
    return "neutral";
  } else {
    return "concerning_minor";
  }
}

function calculatePercentageScore({
  points,
  document_type,
}: {
  points: AnalyticPoint[];
  document_type: "terms" | "privacy";
}) {
  const WEIGHTS = {
    terms: TC_CRITERION_WEIGHTS,
    privacy: PP_CRITERION_WEIGHTS,
  };
  const totalCriteria = Object.keys(WEIGHTS[document_type]).length;
  if (points.length !== totalCriteria) {
    console.warn(
      `Expected ${totalCriteria} points, but received ${points.length}.`
    );
  }
  const hasPayment = points.some(
    (point) => point.category === "payment" && point.text_found
  );
  const selectedWeights = hasPayment
    ? TC_CRITERION_WEIGHTS_WO_PAYMENT
    : WEIGHTS[document_type];
  const scoreMap = new Map(points.map((point) => [point.case_id, point.score]));
  const maxPossibleWeightedScore = Object.values(selectedWeights).reduce(
    (acc, weight) => acc + weight * 2,
    0
  );
  const minPossibleWeightedScore = -maxPossibleWeightedScore;
  const weightedSum = Object.entries(selectedWeights).reduce(
    (acc, [caseId, weight]) => {
      const id = Number(caseId) as keyof typeof selectedWeights;
      const score = scoreMap.get(id) ?? 0;
      return acc + Math.max(-2, Math.min(2, score)) * weight;
    },
    0
  );
  const percentage =
    ((weightedSum - minPossibleWeightedScore) /
      (maxPossibleWeightedScore - minPossibleWeightedScore)) *
    100;
  return Math.round(Math.max(0, Math.min(100, percentage)));
}
