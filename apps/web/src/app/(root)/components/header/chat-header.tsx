"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CircleFadingPlus, ListFilter, MessageCircle, MessageSquareDot, SquarePen, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ChatsHeader() {

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Chats</h2>
                <div className="flex items-center space-x-2">
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
                                <Link href={{ pathname: "/chats/new-story" }} className="flex items-center gap-x-2 px-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-accent flex items-center justify-center">
                                        <CircleFadingPlus />
                                    </div>
                                    <span>New story</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <FilterDropDownMenu />
                </div>
            </div>
            <Input
                type="text"
                placeholder="Search"
                className="mt-3 md:mt-4"
            />
        </>
    )
}


function FilterDropDownMenu() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )
    const handleFilterClick = (filterType: string) => {
        const queryString = createQueryString('filter', filterType)
        router.push(`${pathname}?${queryString}` as any)
    }
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
                <DropdownMenuItem onClick={() => handleFilterClick('all')}>
                    <div className="w-8 h-8 flex items-center justify-center">
                        <MessageCircle />
                    </div>
                    <span>All Chats</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}