import { ApiResponse } from "@/types/api";
import { ofetch } from "ofetch";
import { toast } from "sonner";

export const apiClient = ofetch.create({
  baseURL: `/api/v1`,
  async onResponseError({ response }) {
    const errorData: ApiResponse = response._data;
    toast.error(errorData.error || "Something went wrong.");
  },
});
