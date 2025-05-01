import { ApiResponse } from "@/types/api";
import { QueryClient, isServer } from "@tanstack/react-query";
import { IFetchError } from "ofetch";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      mutations: {
        onError({ response }: IFetchError<ApiResponse>) {
          toast.error(response?._data?.error || "Something went wrong.");
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
