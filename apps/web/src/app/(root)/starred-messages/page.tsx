import React from 'react'
import { PageHeader } from '../components/page-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'starred messages',
    description: 'user starred messages',
}

export default function StarredMessagePage() {
    return (
        <div className='col-span-12'>
            <PageHeader pageTitle="Starred Messages" />
            starred
        </div>
    )
}
