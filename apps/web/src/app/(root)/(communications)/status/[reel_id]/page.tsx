import type { Metadata } from "next";
import { ReelsList } from "./component/reels-list";

export async function generateMetadata(
    { params }: { params: Promise<{ reel_id: string }> },
): Promise<Metadata> {
    const reel_id = (await params).reel_id
    return {
        title: `reel-${reel_id}`,
        description: `reel-${reel_id}`,
    }
}
export default function ReelPage() {
    return (
        <>
            <ReelsList />
        </>
    );
}