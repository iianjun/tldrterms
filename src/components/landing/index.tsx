"use client";
import LogoGradientTracing from "@/components/landing/LogoGradientTracing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export default function Landing() {
  return (
    <>
      <h1 className="visually-hidden">TLDRTerms</h1>
      <motion.div
        className="w-full flex-1 flex-center flex-col @md:px-8 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl md:mb-6 md:text-5xl">
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
          <Link href="/login">
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500",
                "opacity-40 group-hover:opacity-60",
                "blur transition-opacity duration-500"
              )}
            />
            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-white dark:text-zinc-900">Get Started</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-white/90 dark:text-zinc-900/90" />
            </div>
          </Link>
        </Button>
      </motion.div>
      <LogoGradientTracing />
    </>
  );
}
