"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { Mic, Send } from "lucide-react";
import { useState } from "react";
import type { Socket } from "socket.io-client";
import ImagesInput from "./images-input";

interface MessageInputProps {
    sender_id: string | undefined,
    roomId: string,
    socket: Socket
}

export default function MessageInput({ sender_id, roomId, socket }: MessageInputProps) {
    const mutate = useMutation(trpc.messages.saveMessage.mutationOptions())
    const uploadImageMutation = useMutation(trpc.messages.uploadImage.mutationOptions());
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const handleSendTextMessage = () => {
        if (!newMessage.trim() || !sender_id || !roomId) return;
        const messageData = {
            roomId: roomId,
            content: newMessage.trim(),
            senderId: sender_id,
            type: "TEXT" as const
        };
        socket.emit("send", messageData);
        mutate.mutateAsync(messageData);
        setNewMessage("");
    };

    const handleSendImageMessage = async (imageFile: File) => {
        if (!sender_id || !roomId) return;
        const imageUrl = await uploadImage(imageFile)
        const messageData = {
            roomId: roomId,
            content: newMessage.trim() || "",
            senderId: sender_id,
            type: "IMAGE" as const,
            fileUrl: imageUrl,
            fileName: imageFile.name,
            fileSize: imageFile.size
        };
        socket.emit("send", messageData);
        await mutate.mutateAsync(messageData);
        setSelectedImage(null);
        setNewMessage("");
    };

    const handleImageSelect = (file: File) => {
        setSelectedImage(file);
    };

    const handleSendMessage = () => {
        if (selectedImage) {
            handleSendImageMessage(selectedImage);
        } else {
            handleSendTextMessage();
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.readAsDataURL(file);
        });

        const result = await uploadImageMutation.mutateAsync({ image: base64 });
        return result.url;
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const removeSelectedImage = () => {
        setSelectedImage(null);
    };

    const isUploading = uploadImageMutation.isPending;
    const isSendDisabled = isUploading || (!newMessage.trim() && !selectedImage);


    return (
        <div className="p-4 bg-card">
            {selectedImage && <ImagePreview selectedImage={selectedImage} removeSelectedImage={removeSelectedImage} />}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <ImagesInput onImageSelect={handleImageSelect} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Mic className="size-4" />
                    </Button>
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


interface ImagePreviewProps {
    selectedImage: File;
    removeSelectedImage: () => void;
}

const ImagePreview = ({ selectedImage, removeSelectedImage }: ImagePreviewProps) => {
    return (
        <div className="mb-2 p-2 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs bg-black">IMG</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{selectedImage.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(selectedImage.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeSelectedImage}
                    className="h-6 text-muted-foreground hover:text-destructive"
                >
                    Remove
                </Button>
            </div>
        </div>
    )
}