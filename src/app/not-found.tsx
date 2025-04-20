import ErrorComponent from "@/components/errors";

export default function NotFound() {
  return <ErrorComponent statusCode={404} />;
}
