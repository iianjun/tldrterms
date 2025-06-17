import AuthLayout from "@/components/auth/Layout";
import ResetForm from "@/components/auth/ResetForm";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  const description =
    "Securely reset your TL;DR Terms account password using the link sent to your email.";

  return {
    title: "Reset Password",
    description,
    openGraph: {
      title: "Reset Password",
      description,
      url: "https://tldrterms.app/reset-password",
    },
    twitter: {
      title: "Reset Password",
      description,
    },
    alternates: {
      canonical: "https://www.tldrterms.app/reset-password",
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
};
export default async function ResetPasswordPage() {
  return (
    <main className="@container relative flex h-svh pt-header-h">
      <AuthLayout>
        <ResetForm />
      </AuthLayout>
    </main>
  );
}
