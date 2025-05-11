import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return CustomResponse.error({
      errorCode: "LOGOUT_ERROR",
      message: error.message,
      status: error.status || 500,
    });
  }
  return CustomResponse.success({
    data: true,
  });
}
