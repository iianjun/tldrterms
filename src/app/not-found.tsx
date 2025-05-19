import ErrorComponent from "@/components/errors";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense>
      <ErrorComponent statusCode={404} />
    </Suspense>
  );
}
