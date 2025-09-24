import { router } from "@/lib/trpc";
import { addGroupMember } from "./addGroupMember";
import { getAllChats } from "./getAllChats";
import { getChatDetails } from "./getChatDetails";
import { getUserFriends } from "./getUserFriends";
import { newChat } from "./newChat";
import { newGroup } from "./newGroup";
export const chatRouter = router({
    getAllChats: getAllChats(),
    getUserFriends: getUserFriends(),
    getChatDetails: getChatDetails(),
    newChat: newChat(),
    newGroup: newGroup(),
    addGroupMember: addGroupMember()
});