import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function ChatList() {
    return (
        <>
            {/* {max - h - svh overflow-y-scroll } */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-e max-h-svh md:max-h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar py-3">
                {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]).map((_ele, index) => (
                    <div key={index} className='border-b flex w-full h-16'>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/abstract-profile.png" />
                            <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <Link href={{
                            pathname: `../chats/username`
                        }}>
                            <div className="flex flex-col justify-center ml-3">
                                <p className="font-extrabold">UserName</p>
                                <p className='text-sm text-accent-foreground/60'>hi sweet</p>
                            </div>
                        </Link>
                    </div>
                ))
                }
            </div>
        </>
    )
}
