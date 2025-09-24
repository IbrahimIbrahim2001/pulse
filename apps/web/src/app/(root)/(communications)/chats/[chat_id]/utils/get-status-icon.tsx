import { Check, CheckCheck } from "lucide-react";
export const getStatusIcon = (status: string) => {
    switch (status) {
        case "sent":
            return <Check size="15" />;
        case "delivered":
            return <CheckCheck size="15" className="opacity-70" />;
        case "read":
            return <CheckCheck size="15" className="text-blue-400" />;
        default:
            return "";
    }
};