import { createClient } from "@/lib/supabase/server";

export async function getAuthentication() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  return {
    userId: user?.id || "",
    isInvalid: userError || !user,
    email: user?.email,
  };
}
