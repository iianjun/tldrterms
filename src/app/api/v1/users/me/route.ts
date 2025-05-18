import { CustomResponse } from "@/lib/response";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountSurveyValues } from "@/types/api";
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

export async function DELETE(request: NextRequest) {
  try {
    const { reasons, otherReason } =
      (await request.json()) as DeleteAccountSurveyValues;
    const { userId, isInvalid } = await getAuthentication();

    if (isInvalid) {
      return CustomResponse.error({
        errorCode: "UNAUTHORIZED",
        status: 401,
      });
    }
    const client = await createClient();
    await client.from("deletion_survey").insert({
      reasons: reasons,
      other_reason: otherReason,
    });
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) {
      return CustomResponse.customError({
        errorCode: "USER_DELETE_ERROR",
        message: error.message,
        status: error.status || 500,
      });
    }
    return CustomResponse.success({
      data: true,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      errorCode: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
  }
}
