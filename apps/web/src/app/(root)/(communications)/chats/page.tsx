import ChatList from "@/app/(root)/(communications)/_components/chat-list";
import CheckIsNotMobile from "@/app/(root)/_components/check-is-not-mobile";
import AddButton from "../../_components/add-button";

export default function ChatsListPage() {
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
