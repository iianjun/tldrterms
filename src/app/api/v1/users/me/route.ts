import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  return CustomResponse.success({
    data: data.user,
  });
}
