"use client";
import {
  AuthErrorIcon,
  InternalErrorIcon,
  NotFoundIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ErrorComponentProps {
  statusCode: 401 | 404 | 500;
  reset?: () => void;
}

const ERROR_MAP = {
  401: {
    title: "Authentication Error",
    description: "Invalid or expired authorization code. Please sign in again.",
  },
  500: {
    title: "Something went wrong",
    description: "Broken, the server is. Patience, you must have.",
  },
  404: {
    title: "Page not found",
    description: "Lost, this page is. In another system, it may be.",
  },
};

const ERROR_CODE_MAP = {
  USER_DELETED: "Account has been deleted. Please sign up again.",
};

export default function ErrorComponent({
  statusCode,
  reset,
  className,
}: ErrorComponentProps & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error_code = searchParams.get("error_code");
  const Icon =
    statusCode === 404
      ? NotFoundIcon
      : statusCode === 401
        ? AuthErrorIcon
        : InternalErrorIcon;
  return (
    <div
      className={cn(
        "relative flex min-h-svh w-full flex-col justify-center bg-background p-6 md:p-10",
        className
      )}
    >
      <div className="relative mx-auto w-full max-w-5xl">
        <Icon className="absolute inset-0 h-[50vh] w-full text-foreground opacity-[0.04] dark:opacity-[0.03]" />
        <div className="relative z-[1] pt-52 text-center">
          <h1 className="mt-4 text-balance font-semibold text-5xl text-primary tracking-tight sm:text-7xl">
            {ERROR_MAP[statusCode].title}
          </h1>
          <p className="mt-6 text-pretty font-medium text-lg text-muted-foreground sm:text-xl/8">
            {ERROR_CODE_MAP[error_code as keyof typeof ERROR_CODE_MAP] ||
              ERROR_MAP[statusCode].description}
          </p>
          <div className="mt-10 flex flex-col gap-x-6 gap-y-3 sm:flex-row sm:items-center sm:justify-center">
            <Button onClick={() => router.back()}>
              <ArrowLeftIcon
                className="group-hover:-translate-x-0.5 ms-0 me-2 opacity-60 transition-transform"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Go back
            </Button>
            <Button className="-order-1 sm:order-none" asChild>
              <Link href="/">Take me home</Link>
            </Button>
            {reset && (
              <Button className="-order-1 sm:order-none" onClick={reset}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
