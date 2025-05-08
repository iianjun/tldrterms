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
import { useCategories } from "@/hooks/useCatetgories";
import { cn } from "@/lib/utils";
import {
  Analytic,
  AnalyticPoint,
  AnalyticPointCategory,
} from "@/types/supabase";
import { ShieldIcon } from "lucide-react";
import { useMemo } from "react";

function AnalysisBreakdown({ analytic }: { analytic: Analytic }) {
  const categories = useCategories();
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
        {analytic.china_data_processing_details && (
          <div className="mb-8 p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/30 dark:border-red-900">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <ShieldIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Data Processing in China
                </h3>
                <p className="mt-2 text-sm">
                  {analytic.china_data_processing_details}
                </p>
                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium">
                    Why this matters: Data processed or stored in China may be
                    subject to access by Chinese authorities without notice or
                    user consent. This can compromise your privacy and security
                    regardless of other protections in the terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
