import GitHub from "@/assets/icons/github.svg";
import Google from "@/assets/icons/google.svg";
import InternalError from "@/assets/icons/internal-error.svg";
import Logo from "@/assets/icons/logo.svg";
import NotFound from "@/assets/icons/not-found.svg";
import TypoLogo from "@/assets/icons/typo-logo.svg";
import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {}

export const LogoIcon = (props: IconProps) => {
  return <Logo {...props} />;
};

export const TypoLogoIcon = (props: IconProps) => {
  return <TypoLogo {...props} />;
};

export const GitHubIcon = (props: IconProps) => {
  return <GitHub {...props} />;
};

export const GoogleIcon = (props: IconProps) => {
  return <Google {...props} />;
};

export const NotFoundIcon = (props: IconProps) => {
  return <NotFound {...props} />;
};

export const InternalErrorIcon = (props: IconProps) => {
  return <InternalError {...props} />;
};
