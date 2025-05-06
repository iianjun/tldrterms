import ErrorComponent from "@/components/errors";

export default function NotFound() {
  return <ErrorComponent statusCode={404} className="h-full min-h-auto" />;
}
