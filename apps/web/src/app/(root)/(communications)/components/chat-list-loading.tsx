import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/ui/avatar'
import ListHeader from '../../components/header/list-header'

export default function ListLoading() {
    return (
        <div className="w-full border-e md:h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar mb-16 md:mb-0">
            <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                <ListHeader />
            </div>
            <div className="md:pb-20">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center w-full p-4 hover:bg-muted/50 transition-colors duration-200 border-b border-border/50 group"
                    >
                        <div className="flex-shrink-0">
                            <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                                <Skeleton className="w-full h-full rounded-full" />
                            </Avatar>
                        </div>
                        <div className="flex flex-col justify-center ml-4 flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-12 ml-2" />
                            </div>
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
