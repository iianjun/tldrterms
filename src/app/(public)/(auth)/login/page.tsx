import LoginForm from "@/components/auth/LoginForm";
import OAuthButton from "@/components/auth/OAuthButton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="mx-auto flex w-82.5 flex-col justify-center sm:w-96">
      <div className="mb-10">
        <h2 className="mb-2 text-2xl lg:text-3xl">Welcome back</h2>
        <h3 className="text-muted-foreground text-sm">
          Sign in to your account
        </h3>
      </div>
      <div className="flex flex-col gap-5">
        <OAuthButton provider="google" />
        <OAuthButton provider="github" />
        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-2 text-muted-foreground text-sm">or</span>
          <Separator className="flex-1" />
        </div>
        <LoginForm />
      </div>
      <div className="my-8 self-center text-foreground text-sm">
        <span className="">Don't have an account?</span>{" "}
        <Link
          className="text-foreground underline transition hover:text-muted-foreground"
          href="/signup"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}
