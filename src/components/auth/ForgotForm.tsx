"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/auth";
import { forgotPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof forgotPasswordSchema>;
export default function ForgotForm() {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPassword(email),
    onSuccess: () => {
      toast.success(
        "If you registered using your email and password, you will receive a password reset email. The password reset link expires in 10 minutes.",
        {
          position: "top-right",
        }
      );
      router.push("/login");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(({ email }) => mutate({ email }))}
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
      <Button disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        Send Reset Email
      </Button>
    </form>
  );
}
