import { router } from "@/lib/trpc";
import { deleteAllMessages } from "../chat/deleteAllMessage";
import { saveMessage } from "./saveMessage";
import { updateMessageStatus } from "./updateMessageStatus";

export const messagesRouter = router({
    saveMessage: saveMessage(),
    updateMessageStatus: updateMessageStatus(),
    deleteAllMessages: deleteAllMessages(),
})