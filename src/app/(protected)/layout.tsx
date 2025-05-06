import { createClient } from "@/lib/supabase/server";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) return redirect("/login");
  return <UserStoreProvider user={data.user}>{children}</UserStoreProvider>;
}
