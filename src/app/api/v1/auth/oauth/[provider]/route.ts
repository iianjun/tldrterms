import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const SUPPORTING_PROVIDER = ["google", "github"];
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ provider: Provider }> }
) {
  const { provider } = await params;
  if (!provider || !SUPPORTING_PROVIDER.includes(provider)) {
    return CustomResponse.error({
      errorCode: "AUTH_ERROR",
      status: 400,
    });
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  if (!data?.url || error) {
    return CustomResponse.error({
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
