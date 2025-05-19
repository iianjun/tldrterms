"use client";
import ErrorComponent from "@/components/errors";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "antialiased")}>
        <ErrorComponent statusCode={500} reset={reset} />
      </body>
    </html>
  );
}
