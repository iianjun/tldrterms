import { getQueryClient } from "@/lib/query-client";
import { getCurrentUser } from "@/services/users";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const { data, error } = await queryClient.fetchQuery({
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
  });
  if (!data || error) return redirect("/login");
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
