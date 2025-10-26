import AnimatedLogo from "@/components/animated-logo";
import { ArchivedChatsList } from "../@sideList/components/archived-chat-list";
import CheckIsNotMobile from "../components/check-is-not-mobile";
import { Button } from "@/components/ui/button";
import { ArchiveIcon } from "lucide-react";
export default function ArchiverChatsPage() {
    return (
        <>
            <CheckIsNotMobile>
                <div className="col-span-9 hidden md:grid place-content-center place-items-center space-y-10 w-full md:h-[calc(100vh-64px)]">
                    <AnimatedLogo />
                    <div className="flex flex-col items-center space-y-2 justify-between w-72">
                        <Button type="button" variant="secondary" size="xl">
                            <ArchiveIcon className="size-6" />
                        </Button>
                        <p className="font-bold">Archived Chats</p>
                    </div>
                </div>
            </CheckIsNotMobile>
            <div className="block md:hidden w-full col-span-12">
                <ArchivedChatsList />
            </div>
        </>
    )
}
