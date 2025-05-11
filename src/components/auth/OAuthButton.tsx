"use client";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { oauth } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

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
  const { mutate, isPending } = useMutation({
    mutationFn: () => oauth(provider),
    onSuccess: ({ data }) => {
      if (!data) return;
      window.location.href = data.url;
    },
  });
  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {SOURCE_MAP[provider].icon}
      Continue with {SOURCE_MAP[provider].label}
    </Button>
  );
}
