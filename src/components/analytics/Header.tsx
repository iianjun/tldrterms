"use client";
import { LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 flex h-app-header-h justify-between bg-background p-3">
      <LogoIcon className="h-auto w-6" />
      <Button
        onClick={async () => {
          const supabase = createClient();
          const { error } = await supabase.auth.signOut();
          if (error) {
            return toast.error(error.message);
          }
          router.push("/");
        }}
      >
        Sign out
      </Button>
    </header>
  );
}
