import { router } from "@/lib/trpc";
import { saveMessage } from "./procedures/messages/saveMessage";
import { updateMessageStatus } from "./procedures/messages/updateMessageStatus";
export const messagesRouter = router({
    saveMessage: saveMessage(),
    updateMessageStatus: updateMessageStatus()
})