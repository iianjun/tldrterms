"use client";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

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
      onClick={() => {
        const supabase = createClient();
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          },
        });
      }}
    >
      {SOURCE_MAP[provider].icon}
      Continue with {SOURCE_MAP[provider].label}
    </Button>
  );
}
