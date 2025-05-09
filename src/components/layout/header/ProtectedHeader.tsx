"use client";
import ProfileDropdown from "@/components/layout/header/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { getCredits } from "@/services/credits";
import { useQuery } from "@tanstack/react-query";
import { AlignLeftIcon, PanelLeftIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

function SidebarComponent() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <AlignLeftIcon className="size-6" />
        </Button>
      )}
      <div className={"flex items-center"}>
        {state === "collapsed" && !isMobile && (
          <>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
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
    </>
  );
}

export default function ProtectedHeader({
  showSidebar = false,
}: { showSidebar?: boolean }) {
  const { data } = useQuery({
    queryKey: ["credits"],
    queryFn: getCredits,
  });
  const credits = data?.data || { free: 0, paid: 0 };
  return (
    <header
      className={
        "sticky top-0 flex h-app-header-h items-center justify-between bg-background px-3"
      }
    >
      {showSidebar ? (
        <SidebarComponent />
      ) : (
        <Button className="font-semibold text-lg" asChild variant="ghost">
          <Link href="/analytics">TL;DR Terms</Link>
        </Button>
      )}
      <ProfileDropdown freeCredits={credits.free} />
    </header>
  );
}
