import AnimatedLogo from "@/components/animated-logo"
import { Button } from "@/components/ui/button"
import { Hourglass, Phone } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calls history',
    description: 'Sorry, calls are coming soon...',
}


export default function CallsPage() {
    return (
        <div className="grid place-content-center place-items-center space-y-10 w-full h-[calc(100vh-64px)]">
            <AnimatedLogo />
            <div className="flex flex-col justify-center items-center space-y-2 w-72">
                <Button variant="secondary" size="xl" disabled>
                    <Phone />
                </Button>
                <p className="font-bold">Sorry calls not available right now</p>
                <div className="text-xs text-muted-foreground flex items-center">
                    <p className="animate-pulse">Coming soon...</p>
                    <Hourglass className="ml-1 animate-spin animation-duration-4000 size-3" />
                </div>
            </div>
        </div>
    )
}