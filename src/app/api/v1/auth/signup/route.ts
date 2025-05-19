import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return CustomResponse.error({
      errorCode: "AUTH_BAD_REQUEST",
      status: 400,
    });
  }
  const supabase = await createClient();
  const { data: bannedEmail } = await supabase
    .from("banned_emails")
    .select("id")
    .eq("email", email)
    .single();
  if (bannedEmail) {
    return CustomResponse.customError({
      errorCode: "USER_DELETED",
      message: "User has been deleted",
      status: 400,
    });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });
  if (error) {
    console.error(error);
    return CustomResponse.customError({
      errorCode: "AUTH_ERROR",
      message: error.message,
      status: error.status || 500,
    });
  }
  return CustomResponse.success({
    data: true,
  });
}
