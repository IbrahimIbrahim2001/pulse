import Link from "next/link"
import StaticLogo from "@/components/logo"
import { SignupForm } from "../components/sign-up-form"

export default function LoginPage() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-12 items-center justify-center">
                        <StaticLogo />
                    </div>
                    <p className="font-extrabold text-2xl">
                        Pulse.
                    </p>
                </Link>
                <SignupForm />
            </div>
        </div>
    )
}
