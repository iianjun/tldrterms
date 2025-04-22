import AnalyticRoom from "@/components/analytics/AnalyticRoom";
import { getAnalyticsByRoomId } from "@/services/analytics";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const { data: analytic } = await getAnalyticsByRoomId({ roomId });
  return <AnalyticRoom initialAnalytic={analytic} roomId={roomId} />;
}
