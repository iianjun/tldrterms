import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Provider } from "@supabase/supabase-js";

export function login(credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<boolean>> {
  return apiClient("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function signup(credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<boolean>> {
  return apiClient("/auth/signup", {
    method: "POST",
    body: credentials,
  });
}

export function forgotPassword(email: string): Promise<ApiResponse<boolean>> {
  return apiClient("/auth/forgot", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(password: string): Promise<ApiResponse<boolean>> {
  return apiClient("/auth/reset", {
    method: "POST",
    body: { password },
  });
}

export function logout(): Promise<ApiResponse<boolean>> {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export function oauth(
  provider: string
): Promise<ApiResponse<{ url: string; provider: Provider }>> {
  return apiClient(`/auth/oauth/${provider}`, {
    method: "GET",
  });
}
