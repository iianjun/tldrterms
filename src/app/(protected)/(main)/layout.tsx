import AppSidebar from "@/components/analytics/AppSidebar";
import ProtectedHeader from "@/components/layout/header/ProtectedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client";
import { getRooms } from "@/services/analytics";
import { getCredits } from "@/services/credits";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["rooms"],
      queryFn: ({ pageParam = 0 }) =>
        getRooms({ offset: pageParam, limit: 30 }),
      initialPageParam: 0,
    }),
    queryClient.prefetchQuery({
      queryKey: ["credits"],
      queryFn: getCredits,
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider className="overflow-clip">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <ProtectedHeader showSidebar />
          <main className="flex-1 px-2 md:px-4">{children}</main>
        </div>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
