import { getQueryClient } from "@/lib/query-client";
import { getCurrentUser } from "@/services/users";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useUser() {
  const queryClient = useMemo(getQueryClient, []);
  const { data: result } = useQuery({
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
  });

  const setUser = (updated: Partial<User>) => {
    queryClient.setQueryData(
      ["user", "me"],
      (oldData: Awaited<ReturnType<typeof getCurrentUser>>) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...updated,
          },
        };
      }
    );
  };
  return { user: result?.data, setUser };
}
