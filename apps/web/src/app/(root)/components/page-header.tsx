"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export function PageHeader({ pageTitle }: { pageTitle: string }) {
    return (
        <div className="w-full h-16 flex items-center border-b bg-background z-50 md:hidden">
            <Button variant="ghost" className="absolute left-2" onClick={() => redirect("../chats")}>
                <ArrowLeft className="size-4" />
            </Button>
            <p className="font-bold text-center flex-1">{pageTitle}</p>
        </div>
    )
}