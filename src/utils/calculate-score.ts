import { AnalyticPoint, ScoreCategory } from "@/types/supabase";

const THRESHOLD = {
  lowCoverage: 0.45,
  scoreHarmful: -8,
  scoreExcellent: 10,
  scoreGood: 4,
  scoreNeutral: 3,
  scoreConcerningMinor: -4,
};

interface AssessmentRes {
  score: number;
  category: ScoreCategory;
}

export function calculateScore(points: AnalyticPoint[]): AssessmentRes {
  const category = calculateScoreCategory(points);
  const score = calculatePercentageScore(points);
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
  const HIGH_NEGATIVE_THRESHOLD = TOTAL_LENGTH * 0.2;
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
  // low coverage
  if (coverage < THRESHOLD.lowCoverage) {
    return "incomplete_potentially_risky";
  }
  if (exceedNegThreshold) {
    if (totalScore <= THRESHOLD.scoreHarmful) {
      return "potentially_harmful";
    } else {
      return "concerning_major";
    }
  }
  if (totalScore >= THRESHOLD.scoreExcellent) {
    return "excellent";
  } else if (totalScore >= THRESHOLD.scoreGood) {
    return "good";
  } else if (totalScore > THRESHOLD.scoreConcerningMinor) {
    return "neutral";
  } else {
    return "concerning_minor";
  }
}

// use penalty base system
function calculatePercentageScore(points: AnalyticPoint[]) {
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
