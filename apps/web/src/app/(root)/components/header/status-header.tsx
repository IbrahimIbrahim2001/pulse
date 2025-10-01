"use client";

import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function StatusHeader() {
    const user = authClient.useSession().data?.user
    return (
        <>
            <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="flex items-center justify-between md:p-4">
                    <h2 className="font-semibold text-lg">Status</h2>
                    <div className="flex items-center space-x-2">
                        <Link href={{ pathname: "/chats/new-story" }} className="flex justify-between items-center gap-x-2">
                            <Button variant="ghost" size="icon">
                                <PlusCircleIcon className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center px-4 mt-4 h-16 rounded-sm hover:bg-muted/50 transition-colors duration-200 border-b border-border/50 group">
                    <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                        <AvatarImage src={user?.image || "undefined"} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-between ml-4">
                        <p className="font-semibold text-foreground w-full group-hover:text-primary group-hover:animate-pulse transition-colors duration-200 truncate">My Status</p>
                        <p className="text-sm text-muted-foreground w-full font-semibold">No Updates</p>
                    </div>
                </div>
            </div>
        </>
    )
}