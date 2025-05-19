import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/analytics";
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  if (!data.user?.email) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  const { data: deleteHistory } = await supabase
    .from("deletion_survey")
    .select("*")
    .eq("email", data.user.email)
    .single();
  if (deleteHistory) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error_code=USER_DELETED`
    );
  }
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
