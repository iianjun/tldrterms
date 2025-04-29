"use client";
import {} from "@/components/ui/card";
import { Analytic } from "@/types/supabase";
import Link from "next/link";

interface Props {
  analytic: Analytic;
  url: string;
}

const TITLE_MAP = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
};
function AnalyticsResult({ analytic, url }: Readonly<Props>) {
  return (
    <div className="flex flex-col gap-4 py-8 md:gap-8">
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
    </div>
  );
}

export default AnalyticsResult;
