"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { LogOut, Trash2, Shield } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { trpc } from "@/utils/trpc"
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

const formSchema = z.object({
    password: z.string().min(1, "Password is required"),
})

export default function SettingsConfig() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const mutateDeleteRooms = useMutation(trpc.user.deleteUserRooms.mutationOptions());

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    const handleSignout = () => {
        authClient.signOut()
        redirect("../login")
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsDeleting(true)
        mutateDeleteRooms.mutateAsync();
        const res = await authClient.deleteUser({
            password: values.password
        })
        toast.success("Deleted Account successfully");
        redirect("../login")
    }

    const handleOpenChange = (open: boolean) => {
        setShowDeleteDialog(open)
        if (!open) {
            form.reset()
        }
    }

    return (
        <div>
            <div className="mx-auto max-w-4xl p-6 md:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-8 hidden md:block">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                    <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Security Section */}
                    <Card className="border-border">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Security</CardTitle>
                            </div>
                            <CardDescription>Manage your security settings and sessions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">Sign Out</p>
                                    <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                                </div>
                                <Button type="submit" onClick={handleSignout} variant="outline" className="gap-2 bg-transparent">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            </div>
                            <CardDescription>Irreversible and destructive actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">Delete Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowDeleteDialog(true)}
                                    variant="destructive"
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Link href={{ pathname: "../profile" }} className="w-full flex justify-end">
                    <Button variant="link">
                        update username or password
                    </Button>
                </Link>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={handleOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter your password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter your password to confirm account deletion
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                This action cannot be undone. This will permanently delete your account and remove all your data from
                                                our servers.
                                            </p>
                                            <p className="font-medium text-foreground text-sm">
                                                All of your data will be permanently lost.
                                            </p>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <AlertDialogCancel
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={() => setShowDeleteDialog(false)}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <Button
                                                type="submit"
                                                disabled={isDeleting}
                                                variant="destructive"
                                                className="gap-2"
                                            >
                                                {isDeleting ? "Deleting..." : "Delete Account"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}