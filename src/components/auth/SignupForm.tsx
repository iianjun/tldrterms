"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePassword } from "@/hooks/usePassword";
import { cn } from "@/lib/utils";
import { signup } from "@/services/auth";
import { signupSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CircleCheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PASSWORD_TEXT = {
  hasUppercase: "Uppercase letter",
  hasLowercase: "Lowercase letter",
  hasNumber: "Number",
  hasSpecialChar: "Special character (e.g. !?<>@#$%)",
  isLong: "8 characters or more",
};

type FormData = z.infer<typeof signupSchema>;
export default function SignupForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: FormData) => signup(credentials),
    onSuccess: () => {
      toast.success("Check your email for the confirmation link.");
      router.push("/login");
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const password = watch("password");
  const { validation } = usePassword({ password });

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
        <Label htmlFor="password">Passowrd</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={Boolean(errors.password)}
            className="pe-13"
            onFocus={() => !focused && setFocused(true)}
            {...register("password")}
          />
          <Button
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
            variant="secondary"
            className="-translate-y-1/2 absolute top-1/2 right-2 h-6.5 py-1 pl-3"
          >
            {showPassword ? (
              <EyeIcon style={{ width: 14, height: 14 }} />
            ) : (
              <EyeOffIcon style={{ width: 14, height: 14 }} />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password?.message}</p>
        )}
        <motion.ul
          className="flex flex-col overflow-hidden"
          initial={false}
          animate={focused ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          {Object.entries(validation).map(([key, value]) => (
            <li
              key={key}
              className={cn(
                "inline-flex items-center gap-2 text-muted-foreground transition-colors",
                {
                  "text-green-400": value,
                }
              )}
            >
              {value ? (
                <CircleCheckIcon width={16} height={16} />
              ) : (
                <CircleIcon width={16} height={16} />
              )}
              <p className="text-sm">
                {PASSWORD_TEXT[key as keyof typeof PASSWORD_TEXT]}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
      <Button disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}Sign up
      </Button>
    </form>
  );
}
