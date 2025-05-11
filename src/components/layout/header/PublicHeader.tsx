"use client";
import { LogoIcon, TypoLogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex h-header-h items-center bg-background px-6 justify-between">
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
      <div className="hidden md:flex gap-3 mt-3 md:mt-0">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
      <button
        className="flex items-center justify-center md:hidden"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </button>
      <div
        className={cn(
          "absolute left-0 right-0 z-20 overflow-hidden transition-all duration-300 ease-in-out md:hidden top-header-h",
          isMenuOpen
            ? "max-h-50 opacity-100 border-t bg-background shadow-md"
            : "max-h-0 opacity-0 border-t border-transparent"
        )}
      >
        <div
          className="px-4 py-4 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out"
          style={{
            transform: isMenuOpen ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="w-full justify-start" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
