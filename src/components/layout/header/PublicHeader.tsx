import { LogoIcon, TypoLogoIcon } from "@/components/icons";
import Link from "next/link";
export default function PublicHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex h-header-h items-center bg-background px-6">
      <Link
        href="/"
        aria-label="TLDR Terms Home"
        className="relative flex h-full w-[5.875rem] items-center"
      >
        <LogoIcon className="visible absolute left-0 h-auto w-6 sm:hidden" />
        <div className="invisible absolute opacity-0 sm:visible sm:opacity-100">
          <TypoLogoIcon className="h-auto w-[4.9375rem] md:w-[5.625rem]" />
        </div>
      </Link>
    </header>
  );
}
