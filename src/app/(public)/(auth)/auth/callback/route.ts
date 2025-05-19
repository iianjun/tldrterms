import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  console.log(origin);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/analytics";
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/auth/auth-code-error`);
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
