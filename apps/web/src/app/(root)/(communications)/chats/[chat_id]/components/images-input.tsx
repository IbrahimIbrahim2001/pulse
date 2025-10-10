"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { useRef } from "react";

interface ImagesInputProps {
    onImageSelect: (file: File) => void;
}

export default function ImagesInput({ onImageSelect }: ImagesInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            onImageSelect(file);
        }

        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleButtonClick}
            >
                <Image className="size-4" />
            </Button>
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple={false}
            />
        </>
    );
}