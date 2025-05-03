"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DOCUMENT_TYPE_TITLE_MAP } from "@/constants/document";
import { Analytic } from "@/types/supabase";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  analytic: Analytic;
  url: string;
}

export default function AnalyticsHeader({ analytic, url }: Props) {
  return (
    <>
      <div>
        <h1 className="mb-2 font-bold text-2xl sm:text-3xl">
          {DOCUMENT_TYPE_TITLE_MAP[analytic.document_type]} Analysis
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
      {analytic.china_data_processing_details && (
        <Alert
          variant="destructive"
          className="border-red-600 bg-red-50 dark:bg-red-950"
        >
          <AlertTriangleIcon className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold text-red-600 dark:text-red-400">
            Critical Privacy Concern: Data Processing in China
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2 font-medium">
              These terms indicate that your data may be processed or stored in
              China, which poses significant privacy and security risks.
            </p>
            <p className="text-sm">{analytic.china_data_processing_details}</p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
