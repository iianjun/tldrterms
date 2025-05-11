import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;

  const redirectUrl = searchParams.get("redirectUrl") ?? "/reset-password";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirect(redirectUrl);
    }
  }
  redirect("/auth/auth-code-error");
}
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) {
    return CustomResponse.error({
      errorCode: "RESET_BAD_REQUEST",
      status: 400,
      ignoreToast: true,
    });
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error(error);
    return CustomResponse.error({
      errorCode: "RESET_AUTH_ERROR",
      message: error.message,
      status: error.status || 500,
      ignoreToast: true,
    });
  }
  return CustomResponse.success({
    data: true,
  });
}
