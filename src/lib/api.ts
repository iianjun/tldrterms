import { ApiResponse } from "@/types/api";
import { ofetch } from "ofetch";
import { toast } from "sonner";

const isBrowser = typeof window !== "undefined";

export const apiClient = ofetch.create({
  baseURL: isBrowser ? "/api/v1" : process.env.API_URL,
  async onRequest({ options }) {
    if (isBrowser) return;
    const { headers } = await import("next/headers");
    options.headers = await headers();
  },
  async onResponseError({ response }) {
    const errorData: ApiResponse = response._data;
    if (isBrowser) {
      toast.error(errorData.error || "Something went wrong.");
    }
  },
});
