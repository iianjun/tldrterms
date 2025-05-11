import ProtectedHeader from "@/components/layout/header/ProtectedHeader";
import { getQueryClient } from "@/lib/query-client";
import { getCredits } from "@/services/credits";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function ShellLayout({
  children,
}: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["credits"],
    queryFn: getCredits,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtectedHeader />
      {children}
    </HydrationBoundary>
  );
}
