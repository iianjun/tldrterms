import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
export function createAdminClient() {
  if (typeof window !== "undefined") throw new Error("Server only function");
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
