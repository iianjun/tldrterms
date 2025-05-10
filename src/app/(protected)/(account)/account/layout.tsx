import AccountTabs from "@/components/layout/account/AccountTabs";
import ProtectedHeader from "@/components/layout/header/ProtectedHeader";
import { getQueryClient } from "@/lib/query-client";
import { getCredits } from "@/services/credits";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["credits"],
    queryFn: getCredits,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtectedHeader />
      <main className="mx-auto max-w-5xl scroll-bar mt-7.5">
        <div className="bg-muted rounded-md ml-3 mr-3">
          <div className="pt-3 px-6 border-b border-b-background overflow-hidden">
            <h1 className="text-lg font-semibold leading-8 whitespace-nowrap">
              Account setting
            </h1>
            <AccountTabs />
          </div>
          <div className="pt-6 pb-10 px-6">{children}</div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
