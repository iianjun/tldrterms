import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import { sortBy } from "lodash";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const supabase = await createClient();
    const { userId, isInvalid } = await getAuthentication();
    if (isInvalid) {
      return CustomResponse.error({
        errorCode: "UNAUTHORIZED",
        status: 401,
      });
    }
    const { data: roomData, error: roomError } = await supabase
      .from("analytic_rooms")
      .select(`
        id,
        url,
        analytic_status,
        error_msg,
        analytics (
          id,
          score,
          summary,
          score_category,
          china_data_processing_details,
          created_at,
          document_type,
          analytic_points (
            id,
            category,
            case_id,
            description,
            score,
            text_found
          )
        )
        `)
      .eq("id", Number(roomId))
      .eq("user_id", userId)
      .single();
    if (!roomData || roomError) {
      console.error(roomError);
      return CustomResponse.error({
        errorCode: "ROOM_NOT_FOUND",
        status: 404,
      });
    }
    //sort by case id
    if (roomData.analytics?.analytic_points?.length) {
      roomData.analytics.analytic_points = sortBy(
        roomData.analytics?.analytic_points,
        "case_id"
      );
    }
    return CustomResponse.success({
      data: roomData,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      errorCode: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { text } = await req.json();
    const supabase = await createClient();
    const { userId, isInvalid } = await getAuthentication();
    if (isInvalid) {
      return CustomResponse.error({
        errorCode: "UNAUTHORIZED",
        status: 401,
      });
    }
    const { data, error } = await supabase
      .from("analytic_rooms")
      .update({
        manual_text: text,
        analytic_status: "idle",
      })
      .eq("id", Number(roomId))
      .eq("user_id", userId)
      .select("*")
      .single();
    if (!data || error) {
      console.error(error);
      return CustomResponse.error({
        errorCode: "UPDATE_ROOM_ERROR",
        status: 500,
      });
    }
    return CustomResponse.success({
      data,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      errorCode: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { error } = await supabase
    .from("analytic_rooms")
    .delete()
    .eq("id", Number(roomId))
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return CustomResponse.error({
      errorCode: "DELETE_ROOM_ERROR",
      status: 500,
    });
  }
  return CustomResponse.success({
    data: true,
  });
}
