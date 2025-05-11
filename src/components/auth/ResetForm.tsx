"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/services/auth";
import { ApiResponse } from "@/types/api";
import { resetPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { IFetchError } from "ofetch";
import { useForm } from "react-hook-form";
import { ExternalToast, toast } from "sonner";
import { z } from "zod";
type FormData = z.infer<typeof resetPasswordSchema>;
function ResetForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ password }: { password: string }) => resetPassword(password),
  });
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
        const toastData: ExternalToast = {
          position: "top-right",
          id: "reset-password-toast",
        };
        try {
          toast.loading("Saving password...", toastData);
          await mutateAsync({ password });
          toast.success("Password saved successfully!", toastData);
          router.push("/analytics");
        } catch (e) {
          const error = e as unknown as IFetchError<ApiResponse>;
          toast.error(
            error.response?._data?.error || "Something went wrong.",
            toastData
          );
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
      <Button disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        Save New Password
      </Button>
    </form>
  );
}

export default ResetForm;
