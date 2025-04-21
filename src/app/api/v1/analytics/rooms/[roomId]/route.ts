import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
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
  const { data } = await supabase
    .from("analytics")
    .select("*")
    .eq("room_id", Number(roomId))
    .eq("user_id", user.id)
    .single();
  return CustomResponse.success({
    data,
  });
}
