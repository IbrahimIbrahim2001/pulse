import ChatList from "@/app/(root)/(communications)/components/chat-list";
import CheckIsNotMobile from "@/app/(root)/components/check-is-not-mobile";
import AnimatedLogo from "@/components/animated-logo";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import AddButton from "../../components/add-button";
export default function ChatsListPage() {
    return (
        <>
            <CheckIsNotMobile>
                <Boxes />
            </CheckIsNotMobile >
            <div className="md:hidden w-full">
                <ChatList />
                <AddButton />
            </div>
        </>
    )
}


function Boxes() {
    return (
        <>
            <div className="hidden md:grid place-content-center place-items-center space-y-10 w-full md:h-[calc(100vh-64px)]">
                <AnimatedLogo />
                <div className="flex justify-between w-72">
                    <Link href={{ pathname: "/chats/new-chat" }} className="space-y-5 flex flex-col items-center justify-center">
                        <Button variant="secondary" size="xl">
                            <UserPlus className="size-6" />
                        </Button>
                        <p className="font-bold">New Chat</p>
                    </Link>
                    <Link href={{ pathname: "/chats/new-group" }} className="space-y-5 flex flex-col items-center justify-center">
                        <Button variant="secondary" size="xl">
                            <Users className="size-6" />
                        </Button>
                        <p className="font-bold">New Group</p>
                    </Link>
                    <Link href={{ pathname: "/status/new-status" }} className="space-y-5 flex flex-col items-center justify-center">
                        <Button variant="secondary" size="xl">
                            <CircleFadingPlus className="size-6" />
                        </Button>
                        <p className="font-bold">New Story</p>
                    </Link>
                </div>
            </div>
        </>
    )
}