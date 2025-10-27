import type { Metadata } from "next";
import Conversation from "./components/conversation";

export async function generateMetadata({ params }: { params: { chat_id: string } }): Promise<Metadata> {
    return {
        title: `Chat ${params.chat_id}`,
        description: 'Chat conversation',
    }
}

export default function ConversationPage() {
    return (
        <>
            <Conversation />
        </>
    )
}


