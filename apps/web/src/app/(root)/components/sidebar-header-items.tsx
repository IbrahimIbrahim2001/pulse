'use client';
import { CircleFadingPlus, MessageCircle, Phone } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "../../../components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { motion } from "motion/react"

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

export default function SidebarHeaderItems() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return (
            pathname === href ||
            (pathname.includes("chats") && href.includes("chats"))
        )
    }

    return (
        <>
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
                                {active && <motion.span
                                    layoutId="item"
                                    className="absolute left-0 top-0 bottom-0 w-0.5 my-2 me-2 bg-primary rounded-md"
                                    transition={{ type: "spring", duration: 0.5 }} />}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem >
                )
            })}
        </>
    )
}
