import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@supabase/supabase-js";

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient("/users/me", {
    method: "GET",
  });
}
