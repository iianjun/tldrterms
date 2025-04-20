import { ApiResponse } from "@/types/api";
import { ofetch } from "ofetch";
import { toast } from "sonner";

export const apiClient = ofetch.create({
  baseURL: typeof window !== "undefined" ? "/api/v1" : process.env.API_URL,
  async onResponseError({ response }) {
    const errorData: ApiResponse = response._data;
    if (typeof window !== "undefined") {
      toast.error(errorData.error || "Something went wrong.");
    }
  },
});
