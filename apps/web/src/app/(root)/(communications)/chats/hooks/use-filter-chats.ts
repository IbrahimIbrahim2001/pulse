import type { ChatType } from "@/app/(root)/types/chat"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useFilterChats() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )
    const handleFilterClick = (filterType: string) => {
        const queryString = createQueryString('filter', filterType)
        router.push(`${pathname}?${queryString}` as any)
    }
    return {
        handleFilterClick
    }
}