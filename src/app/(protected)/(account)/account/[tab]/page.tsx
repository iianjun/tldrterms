import PasswordTabContent from "@/components/account/PasswordTabContent";
import GeneralTabContent from "@/components/account/general/GeneralTabContent";
export default async function TabContentPage({
  params,
}: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  return (() => {
    switch (tab) {
      case "general":
        return <GeneralTabContent />;
      case "password":
        return <PasswordTabContent />;
    }
  })();
}
