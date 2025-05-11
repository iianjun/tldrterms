"use client";
import LogoGradientTracing from "@/components/landing/LogoGradientTracing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
export default function Landing() {
  return (
    <>
      <h1 className="sr-only">TLDRTerms</h1>
      <motion.div
        className="w-full flex-1 flex-center flex-col @md:px-8 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <h2 className="mb-4 font-bold text-2xl tracking-tight sm:text-4xl md:mb-6 md:text-5xl">
          Understand Website Terms {/*  */}
          <span className="mt-1 text-blue-500 sm:block">
            Without The Legal Jargon
          </span>
        </h2>
        <p className="mb-4 text-muted-foreground text-sm sm:text-lg md:mb-12 md:max-w-3xl md:text-xl">
          Paste any website&apos;s Terms of Service URL and get a clear,
          easy-to-understand summary with highlighted concerns.
        </p>
        <Button
          asChild
          className={cn(
            "relative h-10 overflow-hidden px-4",
            "bg-zinc-900 dark:bg-zinc-100",
            "transition-all duration-200",
            "group"
          )}
        >
          <Button asChild>
            <Link href="/login">
              <span className="text-white dark:text-zinc-900">Get Started</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5 text-white/90 dark:text-zinc-900/90" />
            </Link>
          </Button>
        </Button>
      </motion.div>
      <LogoGradientTracing />
    </>
  );
}
