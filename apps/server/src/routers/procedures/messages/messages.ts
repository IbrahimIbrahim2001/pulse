import { router } from "@/lib/trpc";
import { deleteAllMessages } from "../chat/deleteAllMessage";
import { saveMessage } from "./saveMessage";
import { updateMessageStatus } from "./updateMessageStatus";
import { messageReaction } from "./messageReaction";
import { removeReaction } from "./removeReaction";

export const messagesRouter = router({
    saveMessage: saveMessage(),
    updateMessageStatus: updateMessageStatus(),
    deleteAllMessages: deleteAllMessages(),
    messageReaction: messageReaction(),
    removeReaction: removeReaction()
})