import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthButtonProps {
    text: string,
    isLoading: boolean
}

export default function AuthButton({ text, isLoading }: AuthButtonProps) {
    return (
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> :
                text
            }
        </Button>
    )
}
