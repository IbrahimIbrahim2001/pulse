import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { Archive, Settings, Star, User2 } from "lucide-react"
import Link from "next/link"
import CheckIsNotMobile from "./check-is-not-mobile"
import SidebarHeaderItems from "./sidebar-header-items"

const FooterItems = [
    {
        title: "Starred messages",
        url: "/starred-messages",
        icon: Star,
    },
    {
        title: "Archived Chats",
        url: "/archiver-chats",
        icon: Archive,
    },
    {
        title: "Setting",
        url: "/setting",
        icon: Settings,
    },
    {
        title: "User-Name",
        url: "/profile",
        icon: User2,
    }
]

export function AppSidebar() {
    return (
        <CheckIsNotMobile>
            <Sidebar collapsible="icon" variant="sidebar">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pulse</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarTrigger />
                            <SidebarMenu>
                                <SidebarHeaderItems />
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        {FooterItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={{
                                        pathname: item.title,
                                    }}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </CheckIsNotMobile>
    )
}