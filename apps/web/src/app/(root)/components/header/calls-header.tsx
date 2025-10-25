import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function CallsHeader() {
    return (
        <div className="w-full sticky top-0 left-0 bg-background z-50">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Calls</h2>
                <Button variant="ghost" size="icon" disabled>
                    <Phone className="size-4" />
                </Button>
            </div>
        </div>
    )
}