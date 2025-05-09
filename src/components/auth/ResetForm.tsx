"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ExternalToast, toast } from "sonner";
import { z } from "zod";
type FormData = z.infer<typeof resetPasswordSchema>;
function ResetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(async ({ password }) => {
        const supabase = createClient();
        try {
          const toastData: ExternalToast = {
            position: "top-right",
            id: "reset-password-toast",
          };
          setLoading(true);
          toast.loading("Saving password...", toastData);
          const { data, error } = await supabase.auth.updateUser({ password });
          if (error || !data.user.email) {
            return toast.error(
              error?.message || "Something went wrong. Please try again later.",
              toastData
            );
          }
          toast.success("Password saved successfully!", toastData);
          await supabase.auth.signInWithPassword({
            email: data.user.email,
            password,
          });
          router.push("/analytics");
        } catch {
          return toast.error("Something went wrong. Please try again later.");
        } finally {
          setLoading(false);
        }
      })}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
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
        {loading && <Loader2Icon className="animate-spin" />}
        Save New Password
      </Button>
    </form>
  );
}

export default ResetForm;
