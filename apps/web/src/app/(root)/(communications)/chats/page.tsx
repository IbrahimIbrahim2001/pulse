import ChatList from "@/app/(root)/(communications)/components/chat-list";
import CheckIsNotMobile from "@/app/(root)/components/check-is-not-mobile";
import AddButton from "../../components/add-button";
export default async function ChatsListPage() {
    return (
        <>
            <CheckIsNotMobile>
                <div className="hidden md:block">Choose A Chat</div>
            </CheckIsNotMobile>
            <div className="md:hidden w-full">
                <ChatList />
                <AddButton />
            </div>
        </>
    )
}
