"use client";
import { DOCUMENT_TYPE_TITLE_MAP } from "@/constants/document";
import Link from "next/link";

interface Props {
  documentType: keyof typeof DOCUMENT_TYPE_TITLE_MAP;
  url: string;
}

export default function AnalyticsHeader({ documentType, url }: Props) {
  return (
    <div>
      <h1 className="mb-2 font-bold text-2xl sm:text-3xl">
        {DOCUMENT_TYPE_TITLE_MAP[documentType]} Analysis
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
  );
}
