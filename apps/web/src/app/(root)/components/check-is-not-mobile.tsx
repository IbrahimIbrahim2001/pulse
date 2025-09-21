"use client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CheckIsNotMobile({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();

    if (isMobile) return null;
    return (
        <>
            {children}
        </>
    )
}
