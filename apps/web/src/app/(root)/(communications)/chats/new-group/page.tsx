import type { Metadata } from "next";
import AddGroupForm from "../components/add-group-form";

export const metadata: Metadata = {
    title: "add new group",
    description: "pulse new group",
};

export default function NewGroupW() {
    return (
        <div className="grid justify-center w-full h-full py-10">
            <AddGroupForm />
        </div>
    )
}
