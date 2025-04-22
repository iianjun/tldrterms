import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return CustomResponse.error({
      message: "Missing URL",
      status: 400,
    });
  }
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return CustomResponse.error({
      message: "Unauthorized",
      status: 401,
    });
  }
  const { data, error: createError } = await supabase
    .from("analytic_rooms")
    .insert({ url, user_id: user.id })
    .select("id")
    .single();
  if (createError) {
    console.error(createError);
    return CustomResponse.error({
      message: "Error creating room",
      status: 500,
    });
  }
  return CustomResponse.success<number>({
    data: data.id,
  });
}
