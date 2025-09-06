"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter()
    const handleLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    }

    return (
        <Button type="button" variant="destructive" onClick={handleLogout}>
            Sign out
        </Button>
    )
}
