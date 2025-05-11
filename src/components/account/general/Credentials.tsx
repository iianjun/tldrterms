import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/providers/UserStoreProvider";
import { MailIcon } from "lucide-react";
import Link from "next/link";

const EMAIL_MAP = {
  email: {
    icon: <MailIcon className="size-7.5 text-muted-foreground" />,
    label: "Email",
  },
  google: {
    icon: <GoogleIcon style={{ width: 30, height: "auto" }} />,
    label: "Google",
  },
  github: {
    icon: <GitHubIcon style={{ width: 30, height: "auto" }} />,
    label: "GitHub",
  },
};
export default function AccountCredentials() {
  const user = useUserStore((state) => state.user);
  if (!user) return <></>;
  return (
    <Card className="bg-muted py-4">
      <CardHeader className="border-b pb-4">
        <CardTitle variant="h2">Account credentials</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {EMAIL_MAP[user.app_metadata.provider as keyof typeof EMAIL_MAP].icon}
          <div>
            <p className="text-sm font-semibold">
              {
                EMAIL_MAP[user.app_metadata.provider as keyof typeof EMAIL_MAP]
                  .label
              }
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Button variant="outline" asChild>
            <Link href="/reset-password">Reset password</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
