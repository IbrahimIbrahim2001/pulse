"use client";
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
} from "@/components/ui/sidebar";
import { Archive, CircleFadingPlus, MessageCircle, Phone, Settings, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CheckIsNotMobile from "./check-is-not-mobile";
import ProfileBadge from "./profile-badge";


const HeaderItems = [
    {
        title: "Chats",
        href: "/chats",
        icon: MessageCircle,
    },
    {
        title: "Calls",
        href: "/calls",
        icon: Phone,
    },
    {
        title: "Status",
        href: "/status",
        icon: CircleFadingPlus,
    },
]


const FooterItems = [
    {
        title: "Starred messages",
        href: "/starred-messages",
        icon: Star,
    },
    {
        title: "Archived Chats",
        href: "/archived-chats",
        icon: Archive,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export default function AppSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return (
            pathname === href ||
            (pathname.includes("chats") && href.includes("chats/")) ||
            (pathname.includes("status") && href.includes("status"))
        )
    }
    return (
        <CheckIsNotMobile>
            <Sidebar collapsible="icon" variant="sidebar">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pulse</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarTrigger />
                            <SidebarMenu>
                                {HeaderItems.map((item) => {
                                    const active = isActive(item.href)
                                    return (
                                        <SidebarMenuItem key={item.title} className={`${active ? " bg-primary/10 rounded" : ""}`}>
                                            <SidebarMenuButton asChild tooltip={item.title}>
                                                <Link href={{
                                                    pathname: item.href,
                                                }}
                                                    className="relative"
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    {active &&
                                                        <motion.span
                                                            layoutId="item"
                                                            className="absolute left-0 top-0 bottom-0 w-0.5 my-2 me-2 bg-primary rounded-md"
                                                            transition={{ type: "spring", duration: 0.5 }}
                                                        />
                                                    }
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem >
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        {FooterItems.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <SidebarMenuItem key={item.title} className={`${active ? " bg-primary/10 rounded" : ""}`}>
                                    <SidebarMenuButton asChild>
                                        <Link href={{
                                            pathname: `../${item.href}`,
                                        }}
                                            className="relative"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                            {active &&
                                                <motion.span
                                                    layoutId="item"
                                                    className="absolute left-0 top-0 bottom-0 w-0.5 my-2 me-2 bg-primary rounded-md"
                                                    transition={{ type: "spring", duration: 0.5 }}
                                                />
                                            }
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        <ProfileBadge />
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </CheckIsNotMobile>
    )
}