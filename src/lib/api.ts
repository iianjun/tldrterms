import { ofetch } from "ofetch";
const isBrowser = typeof window !== "undefined";

export const apiClient = ofetch.create({
  baseURL: isBrowser ? "/api/v1" : process.env.API_URL,
  async onRequest({ options }) {
    if (isBrowser) return;
    const { headers } = await import("next/headers");
    options.headers = await headers();
    console.log("onRequest after headers");
  },
});
