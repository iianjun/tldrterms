import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export function getCredits(): Promise<ApiResponse<{ free: number }>> {
  return apiClient("/credits", {
    method: "GET",
  });
}
