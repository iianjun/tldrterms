import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  DeleteAccountSurveyValues,
  UpdateUserValues,
} from "@/types/api";
import { User } from "@supabase/supabase-js";

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient("/users/me", {
    method: "GET",
  });
}

export function updateProfile(
  data: UpdateUserValues
): Promise<ApiResponse<UpdateUserValues>> {
  return apiClient("/users/me", {
    method: "PATCH",
    body: data,
  });
}

export function deleteAccount(
  data: DeleteAccountSurveyValues
): Promise<ApiResponse<void>> {
  return apiClient("/users/me", {
    method: "DELETE",
    body: data,
  });
}
