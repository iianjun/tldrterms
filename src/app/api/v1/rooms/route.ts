import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { getCounts, spendCredit } from "@/lib/supabase/credit";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/utils/website";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { data: rooms } = await supabase
    .from("analytic_rooms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return CustomResponse.success({
    data: rooms,
  });
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return CustomResponse.error({
      errorCode: "URL_BAD_REQUEST",
      status: 400,
    });
  }
  const newUrl = normalizeUrl(url);
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }

  const { free } = await getCounts({ userId });
  // If free credits are all used and no paid credits
  if (free >= 10) {
    return CustomResponse.error({
      errorCode: "NO_CREDIT",
      status: 402,
    });
  }
  const isError = await spendCredit({
    userId,
  });
  if (isError) {
    return CustomResponse.error({
      errorCode: "NO_CREDIT",
      status: 402,
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
      errorCode: "ROOM_CREATE_ERROR",
      status: 500,
    });
  }
  return CustomResponse.success<number>({
    data: data.id,
  });
}
