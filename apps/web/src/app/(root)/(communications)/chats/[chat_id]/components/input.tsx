"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import type { Socket } from "socket.io-client";
import { useHandleMessageInput } from "../hooks/use-handle-message-input";
import { ImagePreview } from "./image-preview";
import ImagesInput from "./images-input";
interface MessageInputProps {
    sender_id: string | undefined,
    roomId: string,
    socket: Socket
}
export default function MessageInput({ sender_id, roomId, socket }: MessageInputProps) {
    const { newMessage, selectedImage, setNewMessage, removeSelectedImage, handleKeyPress, handleImageSelect, handleSendMessage, isSendDisabled } = useHandleMessageInput(sender_id, roomId, socket);
    return (
        <div className="p-4 bg-card">
            {selectedImage && <ImagePreview selectedImage={selectedImage} removeSelectedImage={() => removeSelectedImage()} />}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <ImagesInput onImageSelect={handleImageSelect} />
                </div>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyUp={handleKeyPress}
                    className="flex-1 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                />
                <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    disabled={isSendDisabled}
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    )
}