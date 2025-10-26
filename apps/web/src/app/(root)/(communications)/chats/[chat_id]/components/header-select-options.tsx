import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useHandleSelectOptions } from "../hooks/use-handle-select-options";
export const SelectOptions = () => {
    const {
        chat,
        isAdmin,
        isGroup,
        deleteMessages,
        deleteGroup,
        leaveChat,
        toggleArchiveChat,
        isChatArchived
    } = useHandleSelectOptions();
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-5">
                    {isGroup ? (
                        //Group Logic
                        isAdmin ? (
                            //Group Admin Logic
                            <>
                                {
                                    chat?.messages && chat?.messages.length > 0 && <DropdownMenuItem onClick={deleteMessages}>
                                        <p className="w-full flex items-center justify-start">
                                            Delete messages
                                        </p>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={deleteGroup}>
                                    <p className="w-full flex items-center justify-start">
                                        Delete group
                                    </p>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={toggleArchiveChat}>
                                    <p className="w-full flex items-center justify-start">
                                        {isChatArchived ? "Unarchive chat" : "Archive chat"}
                                    </p>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            // Group user Logic
                            <DropdownMenuItem onClick={leaveChat}>
                                <p className="w-full flex items-center justify-start">
                                    Leave group
                                </p>
                            </DropdownMenuItem>
                        )
                    ) :
                        //Direct Chat Logic
                        (
                            <>
                                {
                                    chat?.messages && chat?.messages.length > 0 && chat.messages.find(m => m.type === "TEXT") && <DropdownMenuItem onClick={deleteMessages}>
                                        <p className="w-full flex items-center justify-start">
                                            Delete messages
                                        </p>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={leaveChat}>
                                    <p className="w-full flex items-center justify-start">
                                        Delete Chat
                                    </p>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={toggleArchiveChat}>
                                    <p className="w-full flex items-center justify-start">
                                        {isChatArchived ? "Unarchive chat" : "Archive chat"}
                                    </p>
                                </DropdownMenuItem>
                            </>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
