import Logo from "@/assets/icons/logo.svg";
import TypoLogo from "@/assets/icons/typo-logo.svg";
export interface IconProps {
  height?: number;
  width?: number;
  color?: string;
  className?: string;
}

export const LogoIcon = (props: IconProps) => {
  return <Logo {...props} />;
};

export const TypoLogoIcon = (props: IconProps) => {
  return <TypoLogo {...props} />;
};
