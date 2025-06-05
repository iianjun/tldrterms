import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.getUser();
  return CustomResponse.success({
    data: "OK",
  });
}
