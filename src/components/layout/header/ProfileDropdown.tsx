import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { usePluralize } from "@/hooks/usePluralize";
import { useUser } from "@/hooks/useUser";
import { logout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CircleUserRoundIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  freeCredits: number;
}
export default function ProfileDropdown({ freeCredits }: Props) {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => router.push("/"),
  });
  const { user } = useUser();
  const dayText = usePluralize({
    word: "day",
    count: dayjs().add(1, "month").startOf("month").diff(dayjs(), "day"),
    inclusive: true,
  });
  const { theme, setTheme } = useTheme();

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
          {user.user_metadata.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={32}
              height={32}
              className="shrink-0 rounded-full"
            />
          ) : (
            <CircleUserRoundIcon className="size-8" />
          )}

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
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/account/general">
              <UserIcon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />

              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isPending}
            onClick={() => mutate()}
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
