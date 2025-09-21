import ChatList from "@/app/(root)/(communications)/components/chat-list";
import CheckIsNotMobile from "@/app/(root)/components/check-is-not-mobile";
import AddButton from "../components/add-button";
export default function SideList() {
    return (
        <>
            <CheckIsNotMobile>
                <div className="hidden md:flex">
                    <ChatList />
                    <AddButton />
                </div>
            </CheckIsNotMobile>
        </>
    )
}