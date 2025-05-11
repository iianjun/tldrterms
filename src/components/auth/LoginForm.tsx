"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth";
import { loginSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;
export default function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: FormData) => login(credentials),
    onSuccess: () => {
      router.push("/analytics");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((credentials) => mutate(credentials))}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="name@example.com"
          type="email"
          error={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email?.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Passowrd</Label>
          <Button
            className="p-0 h-fit text-muted-foreground"
            variant="link"
            tabIndex={-1}
            asChild
          >
            <Link href="/forgot-password">Forgot Password?</Link>
          </Button>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          error={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password?.message}</p>
        )}
      </div>
      <Button disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}Sign In
      </Button>
    </form>
  );
}
