'use client';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AuthButton from "./auth-button";
import { redirect, useSearchParams } from "next/navigation";

const formSchema = z.object({
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
})

export function ResetPasswordFrom({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") as string;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    const isLoading = form.formState.isSubmitting

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.password !== values.confirmPassword) {
            toast.error("Password do not match");
        } else {
            const { error } = await authClient.resetPassword({
                newPassword: values.password,
                token
            })
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Password updated successfully");
                redirect("../login");
            }
        }
        form.reset()
    }

    if (!token) redirect("../login");

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Reset password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input  {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input  {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <AuthButton text="reset password" isLoading={isLoading} />
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
