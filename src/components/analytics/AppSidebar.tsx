import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup></SidebarGroup>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
