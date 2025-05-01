"use client";
import AnalyticsGroup from "@/components/analytics/details/AnalyticsGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOCUMENT_TYPE_TITLE_MAP } from "@/constants/document";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/providers/CategoryStoreProvider";
import {
  Analytic,
  AnalyticPoint,
  AnalyticPointCategory,
} from "@/types/supabase";
import { useMemo } from "react";

function AnalysisBreakdown({ analytic }: { analytic: Analytic }) {
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
          {DOCUMENT_TYPE_TITLE_MAP[analytic.document_type].toLowerCase()} by
          category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([category, points], index) => (
            <AnalyticsGroup
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
  );
}

export default AnalysisBreakdown;
