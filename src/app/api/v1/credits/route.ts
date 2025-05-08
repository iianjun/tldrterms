import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { getRemainingCounts } from "@/lib/supabase/credit";

export async function GET() {
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { free } = await getRemainingCounts({ userId });
  return CustomResponse.success({
    data: {
      free,
    },
  });
}
