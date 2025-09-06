import { Button } from '@/components/ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'
import React from 'react'

export default function AddButton() {
    return (
        <div className='relative'>
            <div className='absolute bottom-28 right-2 md:bottom-12 z-50'>
                <Button variant="default" size="icon"><MessageSquarePlusIcon /></Button>
            </div>
        </div>
    )
}
