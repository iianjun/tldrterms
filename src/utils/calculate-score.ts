import { AnalyticPoint, AssessmentCategory } from "@/types/openai";

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
  category: AssessmentCategory;
}
export function calculateScore(points: AnalyticPoint[]): AssessmentRes {
  const totalPoints = points.length;
  const HIGH_NEGATIVE_THRESHOLD = totalPoints * 0.2;

  const { totalScore, negativeCount, notFoundCount } = points.reduce(
    (acc, point) => {
      acc.totalScore += point.score;
      if (point.score < 0) acc.negativeCount += 1;
      if (!point.text_found) acc.notFoundCount += 1;
      return acc;
    },
    { totalScore: 0, negativeCount: 0, notFoundCount: 0 }
  );

  const coverage = (totalPoints - notFoundCount) / totalPoints;
  const exceedNegThreshold = negativeCount >= HIGH_NEGATIVE_THRESHOLD;

  const res: Partial<AssessmentRes> = {
    score: totalScore,
  };
  // low coverage
  if (coverage < THRESHOLD.lowCoverage) {
    res["category"] = "incomplete_potentially_risky";
    return res as AssessmentRes;
  }
  if (exceedNegThreshold) {
    if (totalScore <= THRESHOLD.scoreHarmful) {
      res["category"] = "potentially_harmful";
    } else {
      res["category"] = "concerning_major";
    }
    return res as AssessmentRes;
  }
  if (totalScore >= THRESHOLD.scoreExcellent) {
    res["category"] = "excellent";
  } else if (totalScore >= THRESHOLD.scoreGood) {
    res["category"] = "good";
  } else if (totalScore > THRESHOLD.scoreConcerningMinor) {
    res["category"] = "neutral";
  } else {
    res["category"] = "concerning_minor";
  }
  return res as AssessmentRes;
}
