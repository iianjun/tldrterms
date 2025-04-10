import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 flex h-header-h items-center justify-between bg-background px-6">
      <h1 className="mb-4 font-bold text-2xl">TLDRTerms</h1>
      <Button asChild variant="secondary">
        <Link href="/login">Login</Link>
      </Button>
    </header>
  );
}
