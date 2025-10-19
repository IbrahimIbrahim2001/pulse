"use client"
import { Button } from "@/components/ui/button"
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalDescription,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from "@/components/ui/responsive-modal"
import { CircleFadingPlus, UserPlus, Users } from "lucide-react"
import Link from "next/link"
import { useModal } from "../context/modal-context"

export default function Modal() {
    const { isOpen, closeModal } = useModal()
    return (
        <ResponsiveModal open={isOpen} onOpenChange={closeModal}>
            <ResponsiveModalContent>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>What's on your mind</ResponsiveModalTitle>
                    <ResponsiveModalDescription className="flex flex-col gap-2 mt-2">
                        <>
                            <Link href={{ pathname: "/chats/new-chat" }}>
                                <Button
                                    onClick={closeModal}
                                    variant="ghost"
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center justify-center gap-2"
                                >
                                    <UserPlus />
                                    <span>New chat</span>
                                </Button>
                            </Link>
                            <Link href={{ pathname: "/chats/new-group" }}>
                                <Button
                                    onClick={closeModal}
                                    variant="ghost"
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center justify-center gap-2"
                                >
                                    <Users />
                                    <span>New group</span>
                                </Button>
                            </Link>
                            <Link href={{ pathname: "/status/new-status" }}>
                                <Button
                                    onClick={closeModal}
                                    variant="ghost"
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center justify-center gap-2"
                                >
                                    <CircleFadingPlus />
                                    <span>New story</span>
                                </Button>
                            </Link>
                        </>
                    </ResponsiveModalDescription>
                </ResponsiveModalHeader>
            </ResponsiveModalContent>
        </ResponsiveModal>
    )
}
