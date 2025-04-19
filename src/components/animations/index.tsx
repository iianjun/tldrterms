import analyzing from "@/assets/animations/analyzing.json";
import fetching from "@/assets/animations/fetching.json";
import Lottie, { LottieComponentProps } from "lottie-react";

interface AnimationProps extends Omit<LottieComponentProps, "animationData"> {}
export const FetchingAnimation = (props: AnimationProps) => {
  return <Lottie {...props} animationData={fetching} />;
};

export const AnalyzingAnimation = (props: AnimationProps) => {
  return <Lottie {...props} animationData={analyzing} />;
};
