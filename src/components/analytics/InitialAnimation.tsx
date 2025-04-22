"use client";
import { AnalyzingAnimation, FetchingAnimation } from "@/components/animations";
import { motion } from "framer-motion";
import { useMemo } from "react";

const OPTIONS = {
  variants: {
    show: { opacity: 1 },
    hide: { opacity: 0 },
  },
  transition: {
    duration: 0.6,
    ease: "easeInOut",
  },
};
export default function InitialAnimation({
  status,
}: Readonly<{ status: "fetching" | "analyzing" }>) {
  const motionProps = useMemo(() => {
    return {
      initialShow: {
        variants: OPTIONS.variants,
        transition: OPTIONS.transition,
        initial: "show",
        animate: status === "fetching" ? "show" : "hide",
      },
      initialHide: {
        variants: OPTIONS.variants,
        transition: OPTIONS.transition,
        initial: "hide",
        animate: status === "fetching" ? "hide" : "show",
      },
    };
  }, [status]);
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 m-auto aspect-[1] w-3/4 max-w-[31.25rem]">
        <motion.div {...motionProps.initialShow} className="absolute w-full">
          <FetchingAnimation />
        </motion.div>
        <motion.p
          {...motionProps.initialShow}
          className="absolute top-full whitespace-nowrap text-center font-semibold text-2xl"
        >
          Hang tight — we’re reading the fine print for you…
        </motion.p>
        <motion.div {...motionProps.initialHide} className="absolute w-full">
          <AnalyzingAnimation />
        </motion.div>
        <motion.p
          {...motionProps.initialHide}
          className="absolute top-full whitespace-nowrap text-center font-semibold text-2xl"
        >
          Almost there! We’re scoring the document now…
        </motion.p>
      </div>
      {/* */}
    </div>
  );
}

// I have two animation components.
// When one animation is done, I'm going to shrink it and have another component show up
