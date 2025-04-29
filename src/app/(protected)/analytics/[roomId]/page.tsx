import AnalyticRoom from "@/components/analytics/AnalyticRoom";
import { getAnalyticsRoomById } from "@/services/analytics";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const { data: room, error } = await getAnalyticsRoomById({ roomId });
  if (!room || error) return notFound();
  return <AnalyticRoom room={room} />;
}
