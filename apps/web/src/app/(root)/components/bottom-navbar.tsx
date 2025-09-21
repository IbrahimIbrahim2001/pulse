"use client"
import { CircleFadingPlus, MessageSquareTextIcon, Phone } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
const Items = [
    {
        title: "Chats",
        href: "/chats",
        icon: MessageSquareTextIcon,
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

export default function BottomNavbar() {
    const pathname = usePathname()
    const isActive = (href: string) => {
        return (
            pathname === href
        )
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
            <div className="flex h-16 w-full items-center justify-around px-2">
                {Items.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={{ pathname: item.href }}
                            className="flex flex-col items-center "
                        >
                            <div className="relative">
                                <item.icon
                                    className={`w-14 h-7 p-1 rounded-full transition-colors ${active ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                                />
                                {active && <motion.div
                                    layoutId="pill-tabs-active-pill"
                                    className="absolute inset-0 w-full rounded-full bg-primary/10"
                                    transition={{ type: "spring", duration: 0.5 }}
                                />}
                            </div>
                            <span
                                className={`font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                            >
                                {item.title}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
