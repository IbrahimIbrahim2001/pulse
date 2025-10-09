"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { socketClient } from '@/lib/socketClient';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check, MinusCircle, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface AddNewGroupMemberProps {
    groupName: string
}

const formSchema = z.object({
    email: z.email("Please enter a valid email address"),
    group_name: z.string().min(2).max(100),
})

export default function AddNewGroupMember({ groupName }: AddNewGroupMemberProps) {
    const mutate = useMutation(trpc.chat.addGroupMember.mutationOptions());
    const mutateMessage = useMutation(trpc.messages.saveMessage.mutationOptions());
    const socket = useMemo(socketClient, []);
    const user = authClient.useSession().data?.user;
    const [isActive, setIsActive] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            group_name: groupName
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await mutate.mutateAsync(values);
            toast.success("Success!", {
                description: res.message,
            });
            form.reset();
            setIsActive(false);
            const user_id = user?.id;
            if (user_id) {
                const systemMessage = {
                    roomId: res.data.roomId,
                    content: `${res.data.user.name} has been added to the group by ${user?.name}.`,
                    senderId: user_id,
                    type: "SYSTEM" as const
                }
                socket.emit("send", systemMessage)
                mutateMessage.mutateAsync(systemMessage);
            }
        } catch (error: any) {
            if (error?.data?.code === 'NOT_FOUND') {
                if (error.message.includes('User not found')) {
                    toast.error("User Not Found", {
                        description: "No user found with this email address. Please check the email and try again.",
                    });
                } else if (error.message.includes('Group not found')) {
                    toast.error("Group Not Found", {
                        description: "The specified group could not be found.",
                    });
                }
            }
            else if (error?.data?.code === 'CONFLICT') {
                toast.warning("Already a Member", {
                    description: "This user is already a member of the group.",
                });
            }
            else if (error?.data?.code === 'INTERNAL_SERVER_ERROR') {
                toast.error("Error", {
                    description: "Something went wrong. Please try again later.",
                });
            }
            else {
                toast.error("Error", {
                    description: "An unexpected error occurred.",
                });
            }
        }
    };
    const handleToggle = () => {
        setIsActive(!isActive);
        if (isActive) {
            form.reset();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Mobile layout - floating elements */}
                {isActive && (
                    <div className="fixed inset-x-0 top-18 bg-background p-4 border-b shadow-sm md:hidden z-50">
                        <div className="flex flex-col space-y-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder='Enter email to add new member'
                                                className='w-full'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className='w-full' type="submit">Add Member</Button>
                        </div>
                    </div>
                )}
                {/* Desktop layout */}
                <div className='flex flex-row items-center justify-between gap-x-2 w-full'>
                    {isActive ? (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="hidden md:block flex-1 min-w-0">
                                        <FormLabel className="sr-only">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder='Enter email to add new member'
                                                className='w-full'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                size="sm"
                                className='hidden md:flex items-center gap-1 whitespace-nowrap'
                                type="submit"
                            >
                                <Check className="h-4 w-4 md:block lg:hidden" />
                                <span className="hidden lg:block">Add Member</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-card-foreground"
                                type="button"
                                onClick={handleToggle}
                            >
                                <MinusCircle className="h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-card-foreground ml-auto"
                            type="button"
                            onClick={handleToggle}
                        >
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}