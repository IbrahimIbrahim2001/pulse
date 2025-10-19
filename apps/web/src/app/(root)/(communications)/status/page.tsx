import { AddStatusButton } from "./[reel_id]/component/add-status-button";
import { StatusList } from "./component/status-list";
export default function StatusPage() {
    return (
        <div className="block md:hidden py-2 px-5">
            <h2 className="font-semibold text-xl mb-3">Status</h2>
            <div className="w-full">
                <div className="flex space-x-2 overflow-x-auto hide-scrollbar py-2 -mx-5 px-5">
                    <AddStatusButton />
                    <StatusList />
                </div>
            </div>
        </div>
    )
}
