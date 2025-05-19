import { ofetch } from "ofetch";
const isBrowser = typeof window !== "undefined";

export const apiClient = ofetch.create({
  baseURL: isBrowser ? "/api/v1" : process.env.API_URL,
  async onRequest({ options }) {
    if (isBrowser) return;
    const { headers } = await import("next/headers");
    const headersList = await headers();
    headersList.forEach((value, key) => {
      options.headers.set(key, value);
    });
  },
});
