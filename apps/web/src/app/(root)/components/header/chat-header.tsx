"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CircleFadingPlus, ListFilter, SquarePen, UserPlus, Users } from "lucide-react";
import Link from "next/link";

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
                    <Button variant="ghost" size="icon">
                        <ListFilter />
                    </Button>
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