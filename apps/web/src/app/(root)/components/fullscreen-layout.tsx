'use client';

import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import AppBar from "./app-bar";
import BottomNavbar from "./bottom-navbar";

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullscreen = pathname.includes("/chats/");
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
