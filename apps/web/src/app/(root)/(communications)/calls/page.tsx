import AnimatedLogo from "@/components/animated-logo"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import Link from "next/link"

export default function CallsPage() {
    return (
        <div className="grid place-content-center place-items-center space-y-10 w-full h-[calc(100vh-64px)]">
            <AnimatedLogo />
            <div className="flex flex-col justify-center items-center space-y-2 w-72">
                <Button variant="secondary" size="xl" disabled>
                    <Phone />
                </Button>
                <p className="font-bold">Sorry calls not available right now</p>
                <span className="text-xs text-muted-foreground animate-pulse">Coming soon...</span>
            </div>
        </div>
    )
}