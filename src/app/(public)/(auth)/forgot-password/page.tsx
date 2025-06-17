import ForgotForm from "@/components/auth/ForgotForm";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  const description =
    "Reset your TL;DR Terms account password. Enter your email to receive a secure password reset link.";

  return {
    title: "Forgot Password",
    description,
    openGraph: {
      title: "Forgot Password",
      description,
      url: "https://tldrterms.app/forgot-password",
    },
    twitter: {
      title: "Forgot Password",
      description,
    },
    alternates: {
      canonical: "https://www.tldrterms.app/forgot-password",
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
export default async function ForgotPasswordPage() {
  return <ForgotForm />;
}
