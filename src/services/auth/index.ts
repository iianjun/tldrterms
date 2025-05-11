import { apiClient } from "@/lib/api";

export function login(credentials: { email: string; password: string }) {
  return apiClient("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function signup(credentials: { email: string; password: string }) {
  return apiClient("/auth/signup", {
    method: "POST",
    body: credentials,
  });
}

export function forgotPassword(email: string) {
  return apiClient("/auth/forgot", {
    method: "POST",
    body: { email },
  });
}
