"use client";

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation';
import React from 'react'
import { PageHeader } from '../components/page-header';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User settings',
    description: 'user setting theme, delete account, etc...',
}

export default function SettingPage() {
    const handleSignout = () => {
        authClient.signOut();
        redirect("../login")
    }
    return (
        <div className='col-span-12'>
            <PageHeader pageTitle="Settings" />
            <Button onClick={handleSignout} variant="destructive">Signout</Button>
        </div>
    )
}
