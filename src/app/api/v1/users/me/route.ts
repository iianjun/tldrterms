import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  return CustomResponse.success({
    data: data.user,
  });
}

export async function PATCH(request: NextRequest) {
  const { name } = await request.json();
  if (!name) {
    return CustomResponse.customError({
      errorCode: "BAD_REQUEST",
      message: "Name is required",
      status: 400,
    });
  }
  const supabase = await createClient();
  const { isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { error } = await supabase.auth.updateUser({
    data: {
      name,
      full_name: name,
    },
  });
  if (error) {
    return CustomResponse.customError({
      errorCode: "USER_PATCH_ERROR",
      message: error.message,
      status: error.status || 500,
    });
  }
  return CustomResponse.success({
    data: {
      name,
    },
  });
}
