import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { usePluralize } from "@/hooks/usePluralize";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/providers/UserStoreProvider";
import dayjs from "dayjs";
import { CircleUserRoundIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  freeCredits: number;
}
export default function ProfileDropdown({ freeCredits }: Props) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const dayText = usePluralize({
    word: "day",
    count: dayjs().add(1, "month").startOf("month").diff(dayjs(), "day"),
    inclusive: true,
  });
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
        <DropdownMenuGroup>
          <div className="space-y-1.5 py-2 px-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Credits</span>
              <span className="text-xs text-muted-foreground">
                {freeCredits} free remaining
              </span>
            </div>
            <div className="flex mb-1 text-xs">
              <span className="text-muted-foreground">
                Free: {freeCredits}/10
              </span>
            </div>
            <Progress value={freeCredits * 10} />
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground">
                Free credits reset in {dayText}
              </span>
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
