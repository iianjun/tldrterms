"use client";
import AnalyticGroup from "@/components/analytics/AnalyticGroup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/providers/CategoryStoreProvider";
import {
  Analytic,
  AnalyticPoint,
  AnalyticPointCategory,
  ScoreCategory,
} from "@/types/supabase";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  analytic: Analytic;
  url: string;
}

const TITLE_MAP = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
};

const SCORE_CATEGORY_MAP: Record<ScoreCategory, string> = {
  excellent: "Excellent",
  good: "Good",
  neutral: "Neutral",
  concerning_minor: "Concerning (Minor)",
  concerning_major: "Concerning (Major)",
  potentially_harmful: "Potentially Harmful",
  incomplete_potentially_risky: "Incomplete (Potentially Risky)",
};
function AnalyticsResult({ analytic, url }: Readonly<Props>) {
  const categories = useCategoryStore((state) => state.categories);
  const grouped: Map<AnalyticPointCategory, AnalyticPoint[]> = useMemo(() => {
    if (!analytic.analytic_points) return new Map();
    const groups = new Map<AnalyticPointCategory, AnalyticPoint[]>();
    for (const point of analytic.analytic_points) {
      if (!groups.has(point.category)) {
        groups.set(point.category, []);
      }
      groups.get(point.category)?.push(point);
    }
    const filtered = Array.from(groups.keys()).filter((key) =>
      groups.get(key)?.some((point) => point.text_found)
    );
    const ret = new Map<AnalyticPointCategory, AnalyticPoint[]>();
    for (const key of filtered) {
      ret.set(key, groups.get(key) ?? []);
    }
    return ret;
  }, [analytic.analytic_points]);
  const titleMap: Record<AnalyticPointCategory, string> = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category.category_id] = category.title;
        return acc;
      },
      {} as Record<AnalyticPointCategory, string>
    );
  }, [categories]);

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-4 px-2 py-8 md:gap-8 md:px-0">
      <div>
        <h1 className="mb-2 font-bold text-2xl sm:text-3xl">
          {TITLE_MAP[analytic.document_type as keyof typeof TITLE_MAP]} Analysis
        </h1>
        <p className="break-words text-muted-foreground text-sm sm:text-base">
          Analysis for:{" "}
          <Link
            href={url}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {url}
          </Link>
        </p>
      </div>
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="gap-0 pb-2">
            <CardTitle variant="h2" className="text-lg">
              Percentage Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  `mb-2 font-bold text-4xl text-red-500 sm:text-5xl`,
                  {
                    "text-orange-500": analytic.score >= 50,
                    "text-yellow-500": analytic.score >= 60,
                    "text-grenn-400": analytic.score >= 70,
                    "text-grenn-500": analytic.score >= 80,
                  }
                )}
              >
                {analytic.score}/100
              </div>
              <Progress value={analytic.score} className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0 pb-2">
            <CardTitle variant="h2" className="text-lg">
              Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  `mb-2 rounded-lg bg-red-500 px-3 py-2 text-center font-semibold`,
                  {
                    "bg-green-500": analytic.score_category === "excellent",
                    "bg-green-400": analytic.score_category === "good",
                    "bg-blue-400": analytic.score_category === "neutral",
                    "bg-yellow-400":
                      analytic.score_category === "concerning_minor",
                    "bg-orange-500":
                      analytic.score_category === "concerning_major",
                    "bg-red-500":
                      analytic.score_category === "potentially_harmful",
                    "bg-purple-500":
                      analytic.score_category ===
                      "incomplete_potentially_risky",
                  }
                )}
              >
                <span className="text-lg sm:text-xl">
                  {SCORE_CATEGORY_MAP[analytic.score_category]}
                </span>
              </div>
              <p className="mt-1 text-center text-muted-foreground text-xs">
                Based on our analysis criteria
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-0 pb-2">
            <CardTitle variant="h2" className="text-lg">
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="h-28 overflow-y-auto">
            <p className="text-sm">{analytic.summary}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle
            variant="h2"
            className="font-semibold text-2xl leading-none tracking-tight"
          >
            Analysis Breakdown
          </CardTitle>
          <CardDescription>
            Detailed analysis of the{" "}
            {TITLE_MAP[
              analytic.document_type as keyof typeof TITLE_MAP
            ].toLowerCase()}{" "}
            by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([category, points], index) => (
              <AnalyticGroup
                className={cn({
                  "border-t pt-6": index > 0,
                })}
                key={category}
                title={titleMap[category]}
                points={points}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/analytics">Analyze Another Document</Link>
        </Button>
      </div>
    </div>
  );
}

export default AnalyticsResult;
