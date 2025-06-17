import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  const description =
    "Log in to TL;DR Terms to access your analysis history, manage your account, and review summarized terms of service.";

  return {
    title: "Login",
    description,
    openGraph: {
      title: "Login",
      description,
      url: "https://tldrterms.app/login",
    },
    twitter: {
      title: "Login",
      description,
    },
    alternates: {
      canonical: "https://www.tldrterms.app/login",
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
export default async function Page() {
  return <LoginForm />;
}
