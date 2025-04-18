import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/providers/UserStoreProvider";
import { CircleUserRoundIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileDropdown() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  if (!user) return <></>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Open account menu">
          <CircleUserRoundIcon
            className="size-5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={32}
            height={32}
            className="shrink-0 rounded-full"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-foreground text-sm">
              {user.user_metadata.full_name}
            </span>
            <span className="truncate font-normal text-muted-fore text-smground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            const supabase = createClient();
            const { error } = await supabase.auth.signOut();
            if (error) {
              return toast.error(error.message);
            }
            router.push("/");
          }}
        >
          <LogOutIcon
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
