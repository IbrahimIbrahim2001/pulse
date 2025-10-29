import React from 'react'
import { PageHeader } from '../components/page-header'
import type { Metadata } from 'next'
import { StarredList } from './components/starred-list'
import { Button } from '@/components/ui/button'
import AnimatedLogo from '@/components/animated-logo'
import { Star } from 'lucide-react'
import CheckIsNotMobile from '../components/check-is-not-mobile'

export const metadata: Metadata = {
    title: 'starred messages',
    description: 'user starred messages',
}

export default function StarredMessagePage() {
    return (
        <>
            <CheckIsNotMobile>
                <div className="col-span-9 hidden md:grid place-content-center place-items-center space-y-10 w-full md:h-[calc(100vh-64px)]">
                    <AnimatedLogo />
                    <div className="flex flex-col items-center space-y-2 justify-between w-72">
                        <Button type="button" variant="secondary" size="xl">
                            <Star className="size-6" />
                        </Button>
                        <p className="font-bold">Starred Messages</p>
                    </div>
                </div>
            </CheckIsNotMobile>
            <div className="block md:hidden w-full col-span-12">
                <PageHeader pageTitle="Starred Messages" />
                <StarredList />
            </div>
        </>
    )
}
