"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type FormData = z.infer<typeof forgotPasswordSchema>;
export default function ForgotForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      onSubmit={handleSubmit(async ({ email }) => {
        const supabase = createClient();
        try {
          setLoading(true);
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
          });
          if (error) {
            return toast.error(error.message);
          }
          toast.success(
            "If you registered using your email and password, you will receive a password reset email. The password reset link expires in 10 minutes.",
            {
              position: "top-right",
            }
          );
          router.push("/login");
        } catch {
          return toast.error("Something went wrong. Please try again later.");
        } finally {
          setLoading(false);
        }
      })}
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
      <Button disabled={loading}>
        {loading && <Loader2Icon className="animate-spin" />}
        Send Reset Email
      </Button>
    </form>
  );
}
