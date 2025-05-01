import AnalyticsPointCard from "@/components/analytics/details/AnalyticsPointCard";
import { useCategoryStore } from "@/providers/CategoryStoreProvider";
import { AnalyticPoint } from "@/types/supabase";
import { useMemo } from "react";

interface Props {
  title: string;
  points: AnalyticPoint[];
  className?: string;
}

function AnalyticsGroup({ className, title, points }: Props) {
  const categories = useCategoryStore((state) => state.categories);
  const titleMap: Record<number, string> | null = useMemo(() => {
    const category = categories.find(
      (c) => c.category_id === points[0].category
    );
    if (!category || !category.criteria) return null;
    return category.criteria.reduce(
      (acc, criteria) => {
        acc[criteria.case_id] = criteria.title;
        return acc;
      },
      {} as Record<number, string>
    );
  }, [categories, points]);

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <div className="space-y-4">
        {points.map((point) => (
          <AnalyticsPointCard
            key={point.id}
            point={point}
            title={titleMap?.[point.case_id] ?? ""}
          />
        ))}
      </div>
    </div>
  );
}

export default AnalyticsGroup;
