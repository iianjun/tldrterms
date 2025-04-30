import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Category } from "@/types/supabase";

export function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiClient("/categories", {
    method: "GET",
  });
}
