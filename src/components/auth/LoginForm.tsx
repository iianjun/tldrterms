"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;
export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      onSubmit={handleSubmit(async (credentials) => {
        const supabase = createClient();
        try {
          setLoading(true);
          const { error } = await supabase.auth.signInWithPassword(credentials);
          if (error) {
            return toast.error(error.message);
          }
          router.push("/analytics");
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Passowrd</Label>
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
      <Button disabled={loading}>
        {loading && <Loader2Icon className="animate-spin" />}Sign In
      </Button>
    </form>
  );
}
