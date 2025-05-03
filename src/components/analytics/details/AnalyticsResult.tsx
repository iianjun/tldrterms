"use client";
import AnalysisBreakdown from "@/components/analytics/details/AnalysisBreakdown";
import AnalyticsHeader from "@/components/analytics/details/AnalyticsHeader";
import OverviewCards from "@/components/analytics/details/OverviewCards";
import { Button } from "@/components/ui/button";
import { Analytic } from "@/types/supabase";
import Link from "next/link";

interface Props {
  analytic: Analytic;
  url: string;
}

function AnalyticsResult({ analytic, url }: Readonly<Props>) {
  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-4 px-2 py-8 md:gap-8 md:px-0">
      <AnalyticsHeader analytic={analytic} url={url} />
      <OverviewCards analytic={analytic} />
      <AnalysisBreakdown analytic={analytic} />
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/analytics">Analyze Another Document</Link>
        </Button>
      </div>
    </div>
  );
}

export default AnalyticsResult;
