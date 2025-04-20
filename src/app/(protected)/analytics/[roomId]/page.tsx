import { getAnalyticsByRoomId } from "@/services/analytics";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  await getAnalyticsByRoomId({ roomId });
  return <></>;
}
