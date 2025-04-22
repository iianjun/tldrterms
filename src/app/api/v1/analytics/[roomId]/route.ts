import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
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
    const { data: roomData } = await supabase
      .from("analytic_rooms")
      .select(`
        id,
        url,
        analytics (
          id,
          score,
          triggered_geopolitical_risk,
          created_at
        )
        `)
      .eq("id", Number(roomId))
      .eq("user_id", user.id)
      .single();
    if (!roomData) {
      return CustomResponse.error({
        message: "Room not found",
        status: 404,
      });
    }
    return CustomResponse.success({
      data: roomData.analytics,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
