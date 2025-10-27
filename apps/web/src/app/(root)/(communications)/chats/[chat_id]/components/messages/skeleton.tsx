"use client";
import { Skeleton } from '@/components/ui/skeleton'

export function MessageSkeleton() {
    const randomWidthFunc = () => {
        const widths = ['w-48', 'w-56', 'w-40', 'w-64', 'w-52']
        return widths[Math.floor(Math.random() * widths.length)]
    }
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: 10 }, (_, index) => {
                const isRight = index % 2 === 0
                const randomWidth = randomWidthFunc()
                return (
                    <div
                        key={index}
                        className={`flex gap-x-2 ${isRight ? 'justify-end' : 'justify-start'}`}
                    >
                        {!isRight &&
                            <Skeleton className="h-8 w-8 rounded-full" />
                        }
                        <Skeleton className={`min-h-8 px-4 py-2 rounded-lg ${randomWidth}`} />
                    </div>
                )
            })}
        </div>
    )
}