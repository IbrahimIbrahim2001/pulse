import type { Metadata } from "next";
import AddChatForm from "../components/add-chat-form";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "add new chat",
    description: "pulse new chat",
};

export default function NewChat() {
    return (
        <div className="grid place-content-center w-full h-full py-10">
            <Suspense>
                <AddChatForm />
            </Suspense>
        </div>
    )
}
