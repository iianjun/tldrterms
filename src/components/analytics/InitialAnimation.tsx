"use client";
import {
  AnalyzingAnimation,
  ErrorAnimation,
  FetchingAnimation,
} from "@/components/animations";
import { SSEStatus } from "@/types/openai";
import { motion } from "framer-motion";

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

interface Props {
  status: Exclude<SSEStatus, "done">;
  errorMsg?: string | null;
}

const TEXT_MAP = {
  fetching: "Hang tight — we’re reading the fine print for you...",
  analyzing: "Almost there! We’re scoring the document now...",
};
const ANIMATION_MAP = {
  fetching: <FetchingAnimation />,
  analyzing: <AnalyzingAnimation />,
  error: <ErrorAnimation loop={false} autoplay />,
};

function Animation({ status, errorMsg }: Readonly<Props>) {
  return (
    <>
      <motion.div
        variants={OPTIONS.variants}
        transition={OPTIONS.transition}
        exit={{ opacity: 0 }}
        initial={status === "fetching" ? "show" : "hide"}
        animate={"show"}
        className="absolute w-full"
      >
        {ANIMATION_MAP[status]}
      </motion.div>
      {(errorMsg || TEXT_MAP[status as keyof typeof TEXT_MAP]) && (
        <motion.p
          variants={OPTIONS.variants}
          transition={OPTIONS.transition}
          exit={{ opacity: 0 }}
          initial={status === "fetching" ? "show" : "hide"}
          animate={"show"}
          className="absolute top-[calc(100%-2rem)] w-full text-center font-semibold text-2xl"
        >
          {errorMsg || TEXT_MAP[status as keyof typeof TEXT_MAP]}
        </motion.p>
      )}
    </>
  );
}
export default function InitialAnimation({
  status,
  errorMsg,
}: Readonly<Props>) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 m-auto aspect-[1] w-3/4 max-w-[34rem]">
        <Animation key={status} status={status} errorMsg={errorMsg} />
      </div>
    </div>
  );
}
