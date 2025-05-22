import AnalyticsRoom from "@/components/analytics/details/AnalyticsRoom";
import { getQueryClient } from "@/lib/query-client";
import { getAnalyticsRoomById } from "@/services/analytics";
import { getCategories } from "@/services/categories";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const { data } = await getAnalyticsRoomById({ roomId });
  if (data?.analytic_status !== "completed") {
    return {
      title: "Analytics",
      openGraph: {
        title: "Analytics",
        url: "https://tldrterms.app/analytics",
      },
      twitter: {
        title: "Analytics",
      },
      alternates: {
        canonical: "https://tldrterms.app/analytics",
      },
    };
  }
  return {
    title: data.title,
    description: data.analytics?.summary,
    openGraph: {
      title: data.title || undefined,
      description: data.analytics?.summary || undefined,
      url: "https://tldrterms.app/analytics",
    },
    twitter: {
      title: data.title || undefined,
      description: data.analytics?.summary || undefined,
    },
    alternates: {
      canonical: "https://tldrterms.app/analytics",
    },
  };
}
export default async function Page({
  params,
}: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  try {
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: ["rooms", roomId],
        queryFn: () => getAnalyticsRoomById({ roomId }),
      }),
      queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
      }),
    ]);
  } catch (error: any) {
    console.error(error);
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
