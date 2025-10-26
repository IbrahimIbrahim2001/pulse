import { router } from "@/lib/trpc";
import { addGroupMember } from "./addGroupMember";
import { getAllChats } from "./getAllChats";
import { getChatDetails } from "./getChatDetails";
import { getUserFriends } from "./getUserFriends";
import { newChat } from "./newChat";
import { newGroup } from "./newGroup";
import { removeGroupMember } from "./removeGroupMember";
import { leaveChat } from "./leaveChat";
import { deleteGroup } from "./deleteGroup";
import { archiveChat } from "./archiveChat";
import { getArchivedChats } from "./getArchivedChats";
import { unArchiveChat } from "./unarchiveChat";
export const chatRouter = router({
    getAllChats: getAllChats(),
    getUserFriends: getUserFriends(),
    getChatDetails: getChatDetails(),
    newChat: newChat(),
    newGroup: newGroup(),
    addGroupMember: addGroupMember(),
    removeGroupMember: removeGroupMember(),
    leaveChat: leaveChat(),
    deleteGroup: deleteGroup(),
    archiveChat: archiveChat(),
    unArchiveChat: unArchiveChat(),
    getArchivedChats: getArchivedChats()
});