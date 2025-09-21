import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SERVER_URL;
export async function getChatData() {
    const cookies1 = await cookies()
    const authCookie = cookies1.get("better-auth.session_token")
    const response = await fetch(`${url}/trpc/chat.getAllChats`, {
        headers: {
            "Cookie": `${authCookie?.name}=${authCookie?.value}`,
            "Authorization": `Bearer ${authCookie?.value}`
        }
    });
    const result = await response.json();
    return result.result?.data
}