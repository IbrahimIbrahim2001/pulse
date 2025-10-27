import AnimatedLogo from "@/components/animated-logo";
import CheckIsNotMobile from "../../components/check-is-not-mobile";
import { AddStatusButton } from "./[reel_id]/component/add-status-button";
import { MyStory } from "./component/my-story";
import { StatusList } from "./component/status-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Friends status',
    description: 'Friends daily status ',
}


export default function StatusPage() {
    return (
        <>
            <CheckIsNotMobile>
                <div className="grid place-content-center place-items-center space-y-10 w-full h-[calc(100vh-64px)]">
                    <AnimatedLogo />
                    <div className="flex flex-col space-y-2 justify-between w-72">
                        <Link href={{ pathname: "/status/new-status" }} className="space-y-5 flex flex-col items-center justify-center">
                            <Button variant="secondary" size="xl">
                                <CircleFadingPlus className="size-6" />
                            </Button>
                            <p className="font-bold">Tell us about your day</p>
                            <span className="text-xs text-muted-foreground animate-pulse">New Story</span>
                        </Link>
                    </div>
                </div>
            </CheckIsNotMobile>
            <div className="block md:hidden py-2 px-5">
                <h2 className="font-semibold text-xl mb-3">Status</h2>
                <div className="w-full">
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar py-2 -mx-5 px-5">
                        <AddStatusButton />
                        <MyStory />
                        <StatusList />
                    </div>
                </div>
            </div >
        </>
    )
}
