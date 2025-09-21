import ListHeader from "../../components/list-header"
import type { ChatType } from "../../types/chat";
import { getChatData } from "../chats/api/getAllChats";
import Chat from "./chat";
export default async function ChatList() {
    const chats = await getChatData();
    return (
        <>
            <div className="w-full border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <div className="md:pb-20">
                    {chats?.map((chat: ChatType) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}
