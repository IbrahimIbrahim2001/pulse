"use client";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Header from "./components/header";
import MessageInput from "./components/input";
import Messages from "./components/messages";
import { socketClient } from "@/lib/socketClient";
import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX } from "lucide-react";

//protect this

export default function ConversationPage() {
    const { chat_id } = useParams();
    const roomId = chat_id ? chat_id.toString() : "";
    const { data: chat, isLoading: chatLoading } = useQuery(
        trpc.chat.getChatDetails.queryOptions({
            room_id: roomId,
        }),
    );
    const socket = useMemo(socketClient, []);
    const session = authClient.useSession();
    const sender_id = session.data?.user.id;
    const groupName = chat?.type === "GROUP" ? chat.name : undefined

    if (chatLoading) {
        return (
            <div className="w-full flex flex-col h-svh md:h-[calc(100vh-64px)] bg-background">
                <Header members={[]} />  {/* this will set the recipientName to="Unknown User" */}
                {/* <MessageSkeleton /> */}
            </div>
        );
    }
    return (
        <div className="w-full flex flex-col h-svh md:h-[calc(100vh-64px)] bg-background">
            {chat?.members.some(member => member.user.id === sender_id) ? (
                <>
                    {/* Header */}
                    <Header members={chat?.members} groupName={groupName} />
                    {/* Messages */}
                    <Messages sender_id={sender_id} roomId={roomId} socket={socket} chat={chat} />
                    {/* Input Area */}
                    <MessageInput sender_id={sender_id} roomId={roomId} socket={socket} />
                </>
            ) : (
                <RemovedUserContainer />
            )}
        </div>
    );
}


function RemovedUserContainer() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
            <div className="relative">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <UserX className="w-12 h-12 text-muted-foreground" />
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                    Access Removed
                </h2>
                <p className="text-muted-foreground max-w-sm">
                    You are no longer a member of this chat group.
                    The admin may have removed you from the conversation.
                </p>
            </div>
            <Link href={{ pathname: "../chats" }}>
                <Button className="gap-2 px-6 py-2">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Chats
                </Button>
            </Link>
        </div>
    )
} 