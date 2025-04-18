import AppSidebar from "@/components/analytics/AppSidebar";
import ProtectedHeader from "@/components/layout/header/ProtectedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) return redirect("/login");
  return (
    <UserStoreProvider user={data.user}>
      <SidebarProvider className="overflow-clip">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <ProtectedHeader />
          <main className="@container flex-1 px-2 md:px-4">{children}</main>
        </div>
      </SidebarProvider>
    </UserStoreProvider>
  );
}
