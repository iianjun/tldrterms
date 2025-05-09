import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1, "Email is required"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});
