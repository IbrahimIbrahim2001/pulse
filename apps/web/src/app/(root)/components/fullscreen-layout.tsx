'use client';

import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, usePathname } from "next/navigation";
import AppBar from "./app-bar";
import BottomNavbar from "./bottom-navbar";

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { chat_id, reel_id } = useParams();
    const isFullscreen = pathname.includes(`/chats/${chat_id}`) || pathname.includes(`/status/${reel_id}`);
    const isMobile = useIsMobile();
    if (!isMobile || !isFullscreen) {
        return (
            <>
                <AppBar />
                {children}
                <BottomNavbar />
            </>
        )
    }
    else {
        return children
    }
}
