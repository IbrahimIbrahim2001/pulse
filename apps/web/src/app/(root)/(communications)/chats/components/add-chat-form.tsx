'use client';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    email: z.email(),
})

export default function AddChatForm() {
    const mutation = useMutation(trpc.chat.newChat.mutationOptions());
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await mutation.mutateAsync(values, {
            onError(error) {
                toast.error(error.message);
            },
            onSuccess() {
                toast.success("Added new chat");
            }
        })
        form.reset()
    }
    const isLoading = form.formState.isSubmitting;
    return (
        <Card className="min-w-sm max-w-full md:w-[400px]">
            <CardHeader>
                <CardTitle>Add new chat</CardTitle>
                <CardDescription>meet new friends</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="m@example.com" {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>

                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ?
                                <Loader2 className="animate-spin" />
                                :
                                "Add"
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
