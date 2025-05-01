"use client";
import Link from "next/link";

const TITLE_MAP = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
};

interface Props {
  documentType: keyof typeof TITLE_MAP;
  url: string;
}

export default function AnalyticsHeader({ documentType, url }: Props) {
  return (
    <div>
      <h1 className="mb-2 font-bold text-2xl sm:text-3xl">
        {TITLE_MAP[documentType]} Analysis
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
