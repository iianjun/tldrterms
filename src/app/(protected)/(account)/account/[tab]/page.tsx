import PasswordTabContent from "@/components/account/PasswordTabContent";
import GeneralTabContent from "@/components/account/general/GeneralTabContent";
import { redirect } from "next/navigation";

const REGISTERED_TABS = ["general", "password"];
export default async function TabContentPage({
  params,
}: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  if (!REGISTERED_TABS.includes(tab)) {
    return redirect("/account/general");
  }
  return (() => {
    switch (tab) {
      case "general":
        return <GeneralTabContent />;
      case "password":
        return <PasswordTabContent />;
    }
  })();
}
