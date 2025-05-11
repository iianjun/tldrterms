import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return CustomResponse.error({
      errorCode: "FORGOT_BAD_REQUEST",
      status: 400,
    });
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
  });
  if (error) {
    console.error(error);
    return CustomResponse.error({
      errorCode: "AUTH_ERROR",
      message: error.message,
      status: error.status || 500,
    });
  }
  return CustomResponse.success({
    data: true,
  });
}
