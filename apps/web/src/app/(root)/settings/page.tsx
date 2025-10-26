"use client";

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation';
import React from 'react'

export default function SettingPage() {
    const handleSignout = () => {
        authClient.signOut();
        redirect("../login")
    }
    return (
        <div className='col-span-12'>
            <Button onClick={handleSignout} variant="destructive">Signout</Button>
        </div>
    )
}
