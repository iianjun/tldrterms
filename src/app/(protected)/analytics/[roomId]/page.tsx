import AnalyticRoom from "@/components/analytics/AnalyticRoom";
import { CategoryStoreProvider } from "@/providers/CategoryStoreProvider";
import { getAnalyticsRoomById } from "@/services/analytics";
import { getCategories } from "@/services/categories";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const [
    { data: room, error: roomError },
    { data: categories, error: categoryError },
  ] = await Promise.all([getAnalyticsRoomById({ roomId }), getCategories()]);

  if (!room || roomError || !categories || categoryError) return notFound();
  return (
    <CategoryStoreProvider categories={categories}>
      <AnalyticRoom room={room} />
    </CategoryStoreProvider>
  );
}
