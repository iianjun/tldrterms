"use client";
import OAuthButton from "@/components/auth/OAuthButton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SOURCE_MAP = {
  "/login": {
    title: "Welcome back",
    subtitle: "Sign in to your account",
    footer: {
      link: "/signup",
      title: "Don't have an account?",
      text: "Sign Up Now",
    },
  },
  "/signup": {
    title: "Get started",
    subtitle: "Create a new account",
    footer: {
      link: "/login",
      title: "Have an account?",
      text: "Sign In Now",
    },
  },
  "/forgot-password": {
    title: "Reset Your Password",
    subtitle:
      "Enter your email address and we'll send you a link to reset your password.",
    footer: {
      link: "/login",
      title: "Already have an account?",
      text: "Sign In",
    },
  },

  "/reset-password": {
    title: "Reset Your Password",
    subtitle:
      "Enter in a new secure password and press save to update your password",
    footer: {
      link: "/login",
      title: "Already have an account?",
      text: "Sign In",
    },
  },
};

type Pathname = "/login" | "/signup" | "/forgot-password" | "/reset-password";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (usePathname() || "/login") as Pathname;
  return (
    <div className="mx-auto flex w-82.5 flex-col justify-center sm:w-96">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl lg:text-3xl">
          {SOURCE_MAP[pathname].title}
        </h1>
        <h2 className="text-muted-foreground text-sm">
          {SOURCE_MAP[pathname].subtitle}
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        {!["/forgot-password", "/reset-password"].includes(pathname) && (
          <>
            <OAuthButton provider="google" />
            <OAuthButton provider="github" />
            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="px-2 text-muted-foreground text-sm">or</span>
              <Separator className="flex-1" />
            </div>
          </>
        )}
        {children}
      </div>
      <div className="my-8 self-center text-foreground text-sm">
        {SOURCE_MAP[pathname].footer.title}{" "}
        <Link
          className="text-foreground underline transition hover:text-muted-foreground"
          href={SOURCE_MAP[pathname].footer.link}
        >
          {SOURCE_MAP[pathname].footer.text}
        </Link>
      </div>
    </div>
  );
}
