'use client';

import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, usePathname } from "next/navigation";
import AppBar from "./app-bar";
import BottomNavbar from "./bottom-navbar";
import { useState, useEffect } from "react";

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { chat_id, reel_id } = useParams();
    const isFullscreen = pathname.includes(`/chats/${chat_id}`) || pathname.includes(`/status/${reel_id}`) || pathname.includes("archived-chats") || pathname.includes("settings") || pathname.includes("profile") || pathname.includes("starred-messages");
    const isMobile = useIsMobile();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted && (isFullscreen || isMobile)) {
        return <div className="min-h-screen">{children}</div>;
    }
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
