import { LogoIcon, TypoLogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 flex h-header-h items-center justify-between bg-background px-6">
      <h1 className="visually-hidden">TLDRTerms</h1>
      <Link
        href="/"
        aria-label="TLDR Terms Home"
        className="relative flex h-full w-[5.875rem] items-center"
      >
        <LogoIcon className="visible absolute left-0 h-auto w-6 sm:hidden" />
        <div className="invisible absolute opacity-0 sm:visible sm:opacity-100">
          <TypoLogoIcon className="h-auto w-[4.9375rem] will-change-transform md:w-[5.625rem]" />
        </div>
      </Link>
      <Button asChild variant="secondary">
        <Link href="/login">Login</Link>
      </Button>
    </header>
  );
}
