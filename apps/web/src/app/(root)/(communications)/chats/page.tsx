import ChatList from "@/app/(root)/(communications)/components/chat-list";
import CheckIsNotMobile from "@/app/(root)/components/check-is-not-mobile";
import AddButton from "../../components/add-button";
import { getChatData } from "./api/getAllChats";
export default async function ChatsListPage() {
    const initialChats = await getChatData();
    return (
        <>
            <CheckIsNotMobile>
                <div className="hidden md:block">Choose A Chat</div>
            </CheckIsNotMobile>
            <div className="md:hidden w-full">
                <ChatList initialChats={initialChats} />
                <AddButton />
            </div>
        </>
    )
}
