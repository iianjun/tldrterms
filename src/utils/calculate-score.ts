import {
  CATEGORY_HIGH_NEGATIVE_THRESHOLD_PERCENT,
  CATEGORY_THRESHOLD,
  PP_CRITERION_WEIGHTS,
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
  const score =
    document_type === "terms"
      ? calculateTermsPercentageScore(points)
      : calculatePrivacyPercentageScore(points);
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

function calculatePrivacyPercentageScore(points: AnalyticPoint[]) {
  // array validation
  if (!Array.isArray(points) || points.length === 0) {
    console.error("Error: Input 'points' must be a non-empty array.");
    return 0;
  }
  const totalCriteria = Object.keys(PP_CRITERION_WEIGHTS).length;
  // criteria validation
  if (points.length !== totalCriteria) {
    console.warn(
      `Warning: Expected ${totalCriteria} criteria points, but received ${points.length}. Calculation might be skewed if criteria are missing.`
    );
  }
  let weightedSum = 0.0;
  let maxPossibleWeightedScore = 0.0;
  let minPossibleWeightedScore = 0.0;
  let foundCriteriaCount = 0;

  for (const point of points) {
    const { case_id, score, text_found } = point;
    // point validation
    if (
      case_id === undefined ||
      score === undefined ||
      text_found === undefined
    ) {
      console.error(
        `Error: Invalid point structure found: ${JSON.stringify(point)}`
      );
      return 0;
    }
    //case id validation
    if (!(case_id in PP_CRITERION_WEIGHTS)) {
      console.error(
        `Error: Unknown case_id '${case_id}' found in pointsArray.`
      );
      return 0;
    }
    const criterionWeight =
      PP_CRITERION_WEIGHTS[case_id as keyof typeof PP_CRITERION_WEIGHTS];

    //min/max score for normalization
    maxPossibleWeightedScore += criterionWeight * 2.0;
    minPossibleWeightedScore += criterionWeight * -2.0;

    if (text_found) {
      // score range validation
      if (score < -2 || score > 2) {
        console.warn(
          `Warning: Score ${score} for case_id ${case_id} is outside the expected -2 to +2 range.`
        );
      }
      weightedSum += score * criterionWeight;
      foundCriteriaCount += 1;
    }
  }
  const scoreRange = maxPossibleWeightedScore - minPossibleWeightedScore;
  if (scoreRange === 0) {
    console.error(
      "Error: Cannot scale score, max and min possible scores are equal."
    );
    return 0;
  }
  const scaledScorePresentText =
    ((weightedSum - minPossibleWeightedScore) / scoreRange) * 100;

  if (totalCriteria === 0) {
    console.error("Error: Total criteria count is zero.");
    return 0;
  }
  const coverageFactor = foundCriteriaCount / totalCriteria;
  const finalScore = Math.max(
    0,
    Math.min(100, scaledScorePresentText * coverageFactor)
  );
  return Math.round(finalScore);
}

// use penalty base system
function calculateTermsPercentageScore(points: AnalyticPoint[]) {
  const score = points.reduce((acc, point) => {
    if (point.text_found) {
      if (point.score === -1) {
        acc -= 5;
      } else if (point.score === -2) {
        acc -= 10;
      }
    } else {
      if (point.category !== "payment") {
        acc -= 2;
      }
    }
    return acc;
  }, 100);
  // 3. Ensure score is within 0-100 bounds and return integer
  const finalScore = Math.max(0, Math.min(100, score));
  return Math.round(finalScore);
}
