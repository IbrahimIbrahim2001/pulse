import { Badge } from "@/components/ui/badge";
import ListHeader from "../../components/header/list-header";

export function EmptyCalls() {
    return (
        <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
            <div className="hidden md:block md:p-4 md:pb-0 sticky top-0 left-0 bg-background z-50">
                <ListHeader />
            </div>
            <div className="md:pb-20 h-full grid place-content-center">
                <Badge variant="secondary" className="rounded-md">No calls yet</Badge>
            </div>
        </div>
    )
}
