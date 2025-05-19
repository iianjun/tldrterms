import AuthError from "@/assets/icons/auth-error.svg";
import DarkAppearance from "@/assets/icons/dark-appearance.svg";
import GitHub from "@/assets/icons/github.svg";
import Google from "@/assets/icons/google.svg";
import InternalError from "@/assets/icons/internal-error.svg";
import LightAppearance from "@/assets/icons/light-appearance.svg";
import Logo from "@/assets/icons/logo.svg";
import NotFound from "@/assets/icons/not-found.svg";
import SystemAppearance from "@/assets/icons/system-appearance.svg";
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

export const AuthErrorIcon = (props: IconProps) => {
  return <AuthError {...props} />;
};

export const AppearanceIcon = ({
  variant,
  ...props
}: IconProps & { variant: "dark" | "light" | "system" }) => {
  switch (variant) {
    case "dark":
      return <DarkAppearance {...props} />;
    case "light":
      return <LightAppearance {...props} />;
    case "system":
      return <SystemAppearance {...props} />;
  }
};
