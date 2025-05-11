import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { getRemainingCounts, spendCredit } from "@/lib/supabase/credit";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/utils/website";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }

  const { searchParams } = request.nextUrl;
  const offset = Number(searchParams.get("offset") || "0");
  const limit = Number(searchParams.get("limit") || "10");
  const search = (searchParams.get("search") || "").trim();
  const guardedOffset = Number.isNaN(offset) || offset < 0 ? 0 : offset;
  const guardedLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

  let baseQuery = supabase
    .from("analytic_rooms")
    .select(
      `
    id,
    url,
    title,
    created_at
    `,
      { count: "exact" }
    )
    .eq("user_id", userId);
  if (search) {
    baseQuery = baseQuery.or(`title.ilike.%${search}%,url.ilike.%${search}%`);
  }
  const { data, count } = await baseQuery
    .order("created_at", { ascending: false })
    .range(guardedOffset, guardedOffset + guardedLimit - 1);

  return CustomResponse.pagination({
    data: data || [],
    pagination: {
      offset: guardedOffset,
      limit: guardedLimit,
      total: count || 0,
      hasNext: guardedOffset + 1 < Math.ceil((count || 0) / guardedLimit),
    },
  });
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return CustomResponse.customError({
      errorCode: "BAD_REQUEST",
      message: "URL is missing",
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

  const { free } = await getRemainingCounts({ userId });
  // If free credits are all used and no paid credits
  if (free <= 0) {
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
    return CustomResponse.customError({
      errorCode: "ROOM_CREATE_ERROR",
      message: "We couldn’t start the analysis. Please try again shortly",
      status: 500,
    });
  }
  return CustomResponse.success<number>({
    data: data.id,
  });
}
