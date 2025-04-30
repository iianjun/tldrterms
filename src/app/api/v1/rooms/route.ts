import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import { normalizeToWww } from "@/utils/website";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return CustomResponse.error({
      message: "Missing URL",
      status: 400,
    });
  }
  const newUrl = normalizeToWww(url);
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      message: "Unauthorized",
      status: 401,
    });
  }
  const { data, error: createError } = await supabase
    .from("analytic_rooms")
    .insert({ url: newUrl, user_id: userId })
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
