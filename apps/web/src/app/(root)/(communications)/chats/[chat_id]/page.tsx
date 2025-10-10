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
            {/* Header */}
            <Header members={chat?.members} groupName={groupName} />
            {/* Messages */}
            <Messages sender_id={sender_id} roomId={roomId} socket={socket} chat={chat} />
            {/* Input Area */}
            <MessageInput sender_id={sender_id} roomId={roomId} socket={socket} />
        </div>
    );
}