"use client";
import ProfileDropdown from "@/components/layout/header/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { AlignLeftIcon, PanelLeftIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

export default function ProtectedHeader() {
  const { state, isMobile, openMobile, setOpenMobile, setOpen } = useSidebar();
  return (
    <header
      className={
        "sticky top-0 flex h-app-header-h items-center justify-between bg-background px-3"
      }
    >
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(!openMobile)}
        >
          <AlignLeftIcon className="size-6" />
        </Button>
      )}
      <div className={"flex items-center"}>
        {state === "collapsed" && !isMobile && (
          <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <PanelLeftIcon className="size-6" />
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/analytics">
                <SquarePenIcon className="size-6" />
              </Link>
            </Button>
          </>
        )}
        <Button className="font-semibold text-lg" asChild variant="ghost">
          <Link href="/analytics">TL;DR Terms</Link>
        </Button>
      </div>
      <ProfileDropdown />
    </header>
  );
}
