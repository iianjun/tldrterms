import LandingForm from "@/components/landing/LandingForm";

import React from "react";

export default function Landing() {
  return (
    <div className="flex-center h-[calc(100svh-var(--header-h))] w-full flex-col px-6 text-center @md:px-8">
      <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:mb-6 md:text-5xl">
        Understand Website Terms {/*  */}
        <span className="mt-1 text-blue-500 sm:block">
          Without The Legal Jargon
        </span>
      </h2>
      <p className="text-muted-foreground mb-4 text-sm sm:text-lg md:mb-12 md:max-w-3xl md:text-xl">
        Paste any website&apos;s Terms of Service URL and get a clear,
        easy-to-understand summary with highlighted concerns.
      </p>
      <LandingForm />
    </div>
  );
}
