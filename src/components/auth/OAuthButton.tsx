"use client";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface OAuthButtonProps {
  provider: "google" | "github";
}
const SOURCE_MAP = {
  google: {
    label: "Google",
    icon: <GoogleIcon />,
  },
  github: {
    label: "GitHub",
    icon: <GitHubIcon />,
  },
};
export default function OAuthButton({ provider }: Readonly<OAuthButtonProps>) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          },
        });
        if (!data?.url || error) {
          return toast.error("Something went wrong, please try again later.");
        }
      }}
    >
      {SOURCE_MAP[provider].icon}
      Continue with {SOURCE_MAP[provider].label}
    </Button>
  );
}
