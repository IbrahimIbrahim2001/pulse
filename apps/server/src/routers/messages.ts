import { protectedProcedure, router } from "@/lib/trpc";
import { saveMessage } from "./procedures/messages/saveMessage";
import { updateMessageStatus } from "./procedures/messages/updateMessageStatus";
import { uploadImage } from "./procedures/messages/uploadImage";
import { deleteAllMessages } from "./procedures/chat/deleteAllMessage";

export const messagesRouter = router({
    saveMessage: saveMessage(),
    updateMessageStatus: updateMessageStatus(),
    deleteAllMessages: deleteAllMessages(),
    uploadImage: uploadImage()
})