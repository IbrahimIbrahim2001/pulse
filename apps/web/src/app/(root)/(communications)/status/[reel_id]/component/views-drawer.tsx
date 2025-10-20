import type { StoryType } from "@/app/(root)/types/chat"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Eye, View } from "lucide-react";
import { useState } from "react";
import ChatAvatar from "../../../components/chat-avatar";

const snapPoints = ['148px', '355px', 1];

export function ViewsDrawer({ views }: { views: StoryType["views"] }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild className="relative bottom-28 z-50 w-full flex justify-center">
                    <div>
                        <Button variant="ghost">
                            <Eye className="size-4 text-muted-foreground" />
                        </Button>
                    </div>
                </DrawerTrigger>
                <DrawerContent className="z-50">
                    <DrawerHeader>
                        <DrawerTitle>{views.length} views</DrawerTitle>
                        <DrawerDescription>your story viewers</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        {views.map(viewer => (
                            <div key={viewer.user.id}>
                                <div className="flex items-center w-full py-2 px-4 hover:bg-muted/50 transition-colors duration-200  group">
                                    <ChatAvatar recipientName={viewer.user.name} size="h-8 w-8" user_image={viewer.user.image ?? undefined} />
                                    <div className="flex flex-col justify-center ml-4 flex-1 min-w-0">
                                        <p className="font-semibold">{viewer.user.name}</p>
                                        <p className="text-sm text-muted-foreground w-full ">{viewer.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}