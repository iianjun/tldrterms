import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { getCounts } from "@/lib/supabase/credit";

export async function GET() {
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { free } = await getCounts({ userId });
  return CustomResponse.success({
    data: {
      free,
    },
  });
}
