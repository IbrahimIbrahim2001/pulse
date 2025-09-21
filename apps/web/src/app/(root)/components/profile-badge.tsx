'use client';

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { User2 } from "lucide-react";

export default function ProfileBadge() {
    const { data: session } = authClient.useSession();
    const userName = session?.user?.name;
    return (
        <>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <User2 />
                    <span>{userName}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    )
}
