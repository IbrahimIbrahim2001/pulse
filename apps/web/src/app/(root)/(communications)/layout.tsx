import React from 'react'

export default function CommunicationLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='col-span-full md:col-span-8 lg:col-span-9 h-svh max-h-svh md:max-h-[calc(100vh-64px)]'>
            {children}
        </div>
    )
}
