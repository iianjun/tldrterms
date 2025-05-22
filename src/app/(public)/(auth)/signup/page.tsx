import SignupForm from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  const description =
    "Create a free TL;DR Terms account to save your analyses, track summaries, and access personalized features.";

  return {
    title: "Sign Up",
    description,
    openGraph: {
      title: "Sign Up",
      description,
      url: "https://tldrterms.app/signup",
    },
    twitter: {
      title: "Sign Up",
      description,
    },
    alternates: {
      canonical: "https://tldrterms.app/signup",
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
export default function Page() {
  return <SignupForm />;
}
