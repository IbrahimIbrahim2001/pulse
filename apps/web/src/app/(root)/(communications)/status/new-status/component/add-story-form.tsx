"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, XIcon, UploadIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    title: z.string().optional(),
    image: z.instanceof(File).optional(),
    fileUrl: z.string(),
    fileName: z.string(),
    fileSize: z.number()
})

export function AddStoryForm() {
    const queryClient = useQueryClient();
    const mutateNewStory = useMutation(trpc.stories.newStory.mutationOptions());
    const uploadImageMutation = useMutation(trpc.images.uploadImage.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.stories.getStory.queryKey() });
        }
    }));
    const form = useForm<z.infer<typeof formSchema>>();
    const [addTitle, setAddTitle] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.image) {
            const imageFile = values.image;
            const imageUrl = await uploadImage(values.image);
            mutateNewStory.mutateAsync({
                title: values.title,
                fileUrl: imageUrl,
                fileName: imageFile.name,
                fileSize: imageFile.size
            });
        }
        form.reset();
        setPreviewUrl(null);
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

        const result = await uploadImageMutation.mutateAsync({ image: base64 });
        return result.url;
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            form.setValue("image", file);
        }
    };

    const removeImage = () => {
        setPreviewUrl(null);
        form.setValue("image", undefined);
    };

    return (
        <div className="justify-center items-center p-4">
            <Card className="w-sm max-w-md shadow-lg border">
                <CardHeader className="text-center space-y-2 pb-4">
                    <CardTitle className="text-2xl font-bold text-primary ">
                        Add Your Story
                    </CardTitle>
                    <CardDescription className="text-base">
                        Share a moment with your community
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Image Upload Field */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Story Image</FormLabel>
                                        {previewUrl ? (
                                            <ImagePreview previewUrl={previewUrl} removeImage={removeImage} />
                                        ) : (
                                            <div className="space-y-3">
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="cursor-pointer file:cursor-pointer file:border-0 file:bg-secondary  file:px-4 file:py-2 file:rounded-md hover:file:bg-secondary/80 transition-colors cd h-fit flex"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Upload an image for your story (JPEG, PNG, WebP)
                                                </FormDescription>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Title Field with Toggle */}
                            <div className="space-y-3">
                                {addTitle ? (
                                    <div className="space-y-3 animate-in fade-in duration-200">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-medium">Story Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your story title..."
                                                            {...field}
                                                            className="focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Optional: Add a title to your story
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAddTitle(false)}
                                            className="w-full flex items-center gap-2"
                                        >
                                            <XIcon className="h-4 w-4" />
                                            Remove Title
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setAddTitle(true)}
                                        className="w-full flex items-center gap-2 py-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                        Add Title
                                    </Button>
                                )}
                            </div>
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full  transition-all duration-200"
                                disabled={!previewUrl || form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ?
                                    <Loader2Icon className="animate-spin" />
                                    :
                                    <>
                                        <UploadIcon className="h-4 w-4 mr-2" />
                                        Create Story
                                    </>
                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

function ImagePreview({ previewUrl, removeImage }: { previewUrl: string, removeImage: () => void }) {
    return (
        <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                    width={100}
                    height={192}
                    src={previewUrl}
                    alt="Preview"
                    className="object-cover"
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>
            <FormDescription>
                Image selected. Click the X to change.
            </FormDescription>
        </div>
    )
}