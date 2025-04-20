"use client";
import ErrorComponent from "@/components/errors";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ErrorComponent statusCode={500} reset={reset} />
      </body>
    </html>
  );
}
