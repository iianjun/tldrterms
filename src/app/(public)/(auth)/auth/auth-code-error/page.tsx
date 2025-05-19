import ErrorComponent from "@/components/errors";

export default async function AuthCodeErrorPage() {
  return <ErrorComponent statusCode={401} />;
}
