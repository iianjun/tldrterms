import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getRooms } from "@/services/analytics";
import { groupBy } from "lodash";
import Link from "next/link";

export default async function AppSidebar() {
  const { data: rooms } = await getRooms();
  const grouped = groupBy(rooms, (room) => room.created_at.split("T")[0]);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {Object.entries(grouped).map(([date, rooms]) => (
          <SidebarGroup key={date}>
            <SidebarGroupLabel>{date}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rooms.map((room) => (
                  <SidebarMenuItem key={room.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/analytics/${room.id}`}>
                        <span>{room.title ?? room.url}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
