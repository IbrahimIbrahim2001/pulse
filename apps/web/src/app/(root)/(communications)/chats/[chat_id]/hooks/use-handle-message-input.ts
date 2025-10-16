import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Socket } from "socket.io-client";

export const useHandleMessageInput = (sender_id: string | undefined, roomId: string, socket: Socket) => {
    const mutate = useMutation(trpc.messages.saveMessage.mutationOptions())
    const uploadImageMutation = useMutation(trpc.images.uploadImage.mutationOptions());
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

    return {
        newMessage,
        selectedImage,
        setNewMessage,
        removeSelectedImage,
        handleKeyPress,
        handleImageSelect,
        handleSendMessage,
        isSendDisabled
    }

}