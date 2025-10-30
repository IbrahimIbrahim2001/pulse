"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, CircleFadingPlus, ListFilter, MessageSquareDot, SquarePen, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useFilterChats } from "../../(communications)/chats/hooks/use-filter-chats";
import { motion } from "motion/react";

export default function ChatsHeader() {
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");
    const headerTitle = filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "Chats";
    const pathname = usePathname();
    const handleClick = () => {
        redirect(`../${pathname}`.replace("?filter=" + filter, ""));
    }
    return (
        <>
            <div className="flex items-center justify-between">
                {filter &&
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <ArrowLeft className="size-5  mr-2" onClick={handleClick} />
                    </motion.div>
                }
                <motion.h2
                    className="flex-1 font-semibold text-lg"
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    exit={{ opacity: 0, y: -20 }}
                    key={headerTitle}
                >
                    {headerTitle}
                </motion.h2>
                <div className="flex items-center space-x-2">
                    <NewDropDownMenu />
                    <FilterDropDownMenu />
                </div>
            </div>
        </>
    )
}


function FilterDropDownMenu() {
    const { handleFilterClick } = useFilterChats();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <ListFilter />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuLabel className="px-4 text-muted-foreground">filter chats by</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterClick('unread')}>
                    <div className="w-8 h-8 flex items-center justify-center">
                        <MessageSquareDot />
                    </div>
                    <span>Unread</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterClick('groups')}>
                    <div className="w-8 h-8 flex items-center justify-center">
                        <Users />
                    </div>
                    <span>Groups</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


function NewDropDownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <SquarePen />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                    <Link href={{ pathname: "/chats/new-chat" }} className="flex items-center gap-x-2 px-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-accent flex items-center justify-center">
                            <UserPlus className="" />
                        </div>
                        <span>New chat</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={{ pathname: "/chats/new-group" }} className="flex items-center gap-x-2 px-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-border flex items-center justify-center">
                            <Users />
                        </div>
                        <span>New group</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={{ pathname: "../status/new-status" }} className="flex items-center gap-x-2 px-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-accent flex items-center justify-center">
                            <CircleFadingPlus />
                        </div>
                        <span>New story</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}