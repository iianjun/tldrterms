import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Header() {
  return (
    <header className="h-header-h bg-background fixed top-0 right-0 left-0 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold">TLDRTerms</h1>
      <Button asChild variant="secondary">
        <Link href="/login">Login</Link>
      </Button>
    </header>
  );
}
