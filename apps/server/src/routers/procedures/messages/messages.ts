
import { deleteAllMessages } from "../chat/deleteAllMessage";
import { saveMessage } from "./saveMessage";
import { updateMessageStatus } from "./updateMessageStatus";
import { messageReaction } from "./messageReaction";
import { removeReaction } from "./removeReaction";
import { removeStarredMessage } from "./removeStarredMessage";
import { getStarredMessage } from "./getStarredMessages";
import { starMessage } from "./starMessage";
import { router } from "../../../lib/trpc";

export const messagesRouter = router({
    saveMessage: saveMessage(),
    updateMessageStatus: updateMessageStatus(),
    deleteAllMessages: deleteAllMessages(),
    messageReaction: messageReaction(),
    removeReaction: removeReaction(),
    getStarredMessage: getStarredMessage(),
    removeStarredMessage: removeStarredMessage(),
    starMessage: starMessage(),
})