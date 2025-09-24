'use client';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutateNewGroup } from "../new-group/hooks/useMutateNewGroup";
import GroupMemberSelector from "./group-members-selector";

const formSchema = z.object({
    name: z.string().min(2),
    members: z.string().array().min(1, "Please select at least one member")
})

export default function AddGroupForm() {
    const mutation = useMutateNewGroup();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            members: []
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await mutation.mutateAsync(values);
        form.reset();
    }

    const isLoading = mutation.isPending;

    return (
        <Card className="min-w-sm max-w-full md:w-[400px] h-fit">
            <CardHeader>
                <CardTitle>Add new group</CardTitle>
                <CardDescription>connect with your friends</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <GroupMemberSelector control={form.control} name="members" />
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Group name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="pulse21" {...field} type="text" />
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