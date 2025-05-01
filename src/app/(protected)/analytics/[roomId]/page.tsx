import AnalyticsRoom from "@/components/analytics/details/AnalyticsRoom";
import { CategoryStoreProvider } from "@/providers/CategoryStoreProvider";
import { getAnalyticsRoomById } from "@/services/analytics";
import { getCategories } from "@/services/categories";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  let roomResult, categoriesResult;
  try {
    [roomResult, categoriesResult] = await Promise.all([
      getAnalyticsRoomById({ roomId }),
      getCategories(),
    ]);
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;
    if (status === 404) return notFound();
    throw error;
  }
  const { data: room, error: roomError } = roomResult;
  const { data: categories, error: categoryError } = categoriesResult;
  if (!room || roomError || !categories || categoryError) return notFound();
  return (
    <CategoryStoreProvider categories={categories}>
      <AnalyticsRoom room={room} />
    </CategoryStoreProvider>
  );
}
