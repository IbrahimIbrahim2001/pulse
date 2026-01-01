import type { Metadata } from "next";
import AddGroupForm from "../components/add-group-form";
import { Suspense } from "react";


export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: "add new group",
    description: "pulse new group",
};

export default function NewGroupPage() {
    return (
        <div className="grid justify-center w-full h-full py-10">
            <Suspense>
                <AddGroupForm />
            </Suspense>
        </div>
    )
}
