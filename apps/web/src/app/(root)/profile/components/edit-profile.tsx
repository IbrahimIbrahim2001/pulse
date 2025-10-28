"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { Shield, User } from 'lucide-react'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const formSchema = z.object({
    currentPassword: z.string().min(1, "Password is required"),
    newPassword: z.string().min(1, "Password is required"),

})

export default function EditProfile() {
    const email = authClient.useSession().data?.user.email;
    const name = authClient.useSession().data?.user.name;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: ""
        },
    })

    const isUpdatingPassword = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (values.currentPassword === values.newPassword) toast.error("Please choose a different password.");
        else {
            const { data, error } = await authClient.changePassword({
                newPassword: values.currentPassword,
                currentPassword: values.newPassword,
                revokeOtherSessions: true,
            });
            if (data) toast.success("updated password successfully");
            else if (error) toast.error(error.message);
        }
        form.reset();
    }
    return (
        <div>
            <div className="mx-auto max-w-4xl p-6 md:p-8 lg:p-12">
                <div className="mb-8 hidden md:block">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
                    <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                <div className="space-y-6">
                    <Card className="border-border">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Account</CardTitle>
                            </div>
                            <CardDescription>Manage your account information and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">Email</p>
                                    <p className="text-sm text-muted-foreground">{email}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">username</p>
                                    <p className="text-sm text-muted-foreground">{name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <CardTitle> Change Password</CardTitle>
                            </div>
                            <CardDescription>Update password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground">Current Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your current password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter your current password
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground">New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter new password
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            variant="secondary"
                                            className="gap-2"
                                        >
                                            {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
