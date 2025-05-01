import AppSidebar from "@/components/analytics/AppSidebar";
import ProtectedHeader from "@/components/layout/header/ProtectedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client";
import { createClient } from "@/lib/supabase/server";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { getRooms } from "@/services/analytics";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) return redirect("/login");
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserStoreProvider user={data.user}>
        <SidebarProvider className="overflow-clip">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <ProtectedHeader />
            <main className="flex-1 px-2 md:px-4">{children}</main>
          </div>
        </SidebarProvider>
      </UserStoreProvider>
    </HydrationBoundary>
  );
}
