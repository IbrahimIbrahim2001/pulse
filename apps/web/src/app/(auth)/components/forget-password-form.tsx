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

const formSchema = z.object({
    email: z.email(),
})

export function ForgetPasswordFrom({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const isLoading = form.formState.isSubmitting

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { error } = await authClient.requestPasswordReset({
                email: values.email
            })
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Email just sent to you");
            }
        } catch (error) {
            toast.error("can't send an email");
        }
        form.reset()
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forget Password</CardTitle>
                    <CardDescription>
                        Send reset password email
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="m@example.com" {...field} type="email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <AuthButton text="send reset email" isLoading={isLoading} />
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
