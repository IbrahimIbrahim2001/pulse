import ChatList from "@/app/(root)/(communications)/_components/chat-list";
import CheckIsNotMobile from "@/app/(root)/_components/check-is-not-mobile";
import AddButton from "../_components/add-button";
export default function SideList() {
  return (
    <>
      <CheckIsNotMobile>
        <ChatList />
        <AddButton />
      </CheckIsNotMobile>
    </>
  )
}