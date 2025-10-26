"use client"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { User2, Upload, X } from "lucide-react"
import { useState, useRef, type ChangeEvent } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { trpc } from "@/utils/trpc"
import Link from "next/link"

export default function ProfileBadge() {
    const mutateImage = useMutation(trpc.images.uploadImage.mutationOptions());
    const image = authClient.useSession().data?.user.image
    const { data: session } = authClient.useSession();
    const userName = session?.user?.name
    const userInitials =
        userName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U"

    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.readAsDataURL(file);
        });

        const result = await mutateImage.mutateAsync({ image: base64 });
        authClient.updateUser({
            image: result.url,
        })
        return result.url;
    };


    const handleSave = async () => {
        if (selectedFile && previewUrl) {
            try {
                const uploadedUrl = await uploadImage(selectedFile)
                setProfileImage(uploadedUrl)
            } catch (e) {
                setProfileImage(previewUrl)
            } finally {
                handleReset()
                setOpen(false)
            }
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleRemovePhoto = () => {
        setProfileImage(null)
        handleReset()
    }

    return (
        <>
            <SidebarMenuItem>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <SidebarMenuButton className="cursor-pointer">
                            {image ?
                                <Image
                                    src={image}
                                    alt={"user image"}
                                    fill
                                    className="max-w-8 max-h-8 rounded-full"
                                />
                                :
                                <User2 className="size-4" />
                            }
                            <p className="ml-8 font-bold text-muted-foreground">{userName}</p>
                        </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Profile Picture</DialogTitle>
                            <DialogDescription>Upload and preview your profile picture</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {profileImage && !selectedFile && (
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="size-32">
                                        <AvatarImage src={image ?? undefined} alt={userName || "User"} />
                                        <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex gap-2">
                                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                                            <Upload className="mr-2 size-4" />
                                            Change Photo
                                        </Button>
                                        <Button onClick={handleRemovePhoto} variant="outline" size="sm">
                                            <X className="mr-2 size-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {!profileImage && !selectedFile && (
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <Avatar className="size-32">
                                        <AvatarImage src={image ?? undefined} alt={userName || "User"} />
                                        <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                                        <Upload className="mr-2 size-4" />
                                        Upload Photo
                                    </Button>
                                </div>
                            )}
                            {previewUrl && selectedFile && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            width={200}
                                            height={200}
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSave} size="sm">
                                            Save
                                        </Button>
                                        <Button onClick={handleReset} variant="outline" size="sm">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <div className=" w-full flex items-center justify-end">
                                <Link href={{ pathname: "/profile" }}>
                                    <Button variant="link" onClick={() => setOpen(false)}>
                                        <p className="text-sm text-primary/70 animate-pulse">
                                            update username or password
                                        </p>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </SidebarMenuItem>
        </>
    )
}
