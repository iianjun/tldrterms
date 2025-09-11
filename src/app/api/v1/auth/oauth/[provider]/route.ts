import { Provider } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

const SUPPORTING_PROVIDER = ["google", "github"];
export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/v1/auth/oauth/[provider]">
) {
  const { provider } = await params;
  if (!provider || !SUPPORTING_PROVIDER.includes(provider)) {
    return CustomResponse.customError({
      errorCode: "BAD_REQUEST",
      message: "Provided provider is not allowed",
      status: 400,
    });
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  if (!data?.url || error) {
    return CustomResponse.customError({
      errorCode: "AUTH_ERROR",
      message:
        error?.message ?? "Something went wrong, please try again later.",
      status: error?.status || 500,
    });
  }
  return CustomResponse.success({
    data: data,
  });
}
