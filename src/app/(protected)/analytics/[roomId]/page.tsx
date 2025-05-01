import AnalyticsRoom from "@/components/analytics/details/AnalyticsRoom";
import { getQueryClient } from "@/lib/query-client";
import { getAnalyticsRoomById } from "@/services/analytics";
import { getCategories } from "@/services/categories";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["rooms", roomId],
        queryFn: () => getAnalyticsRoomById({ roomId }),
      }),
      queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
      }),
    ]);
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;
    if (status === 404) return notFound();
    throw error;
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnalyticsRoom roomId={roomId} />
    </HydrationBoundary>
  );
}
