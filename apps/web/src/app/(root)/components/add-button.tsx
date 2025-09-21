'use client';
import { Button } from '@/components/ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'
import React from 'react'
import { useModal } from '../context/modal-context';

export default function AddButton() {
    const { openModal } = useModal();
    const handleClick = () => {
        openModal();
    }
    return (
        <>
            <div className="fixed bottom-20 right-6 z-50 md:hidden">
                <Button
                    variant="default"
                    size="icon"
                    className="size-12 rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={handleClick}
                >
                    <MessageSquarePlusIcon className="h-6 w-6 dark:text-background" />
                </Button>
            </div >
        </>
    )
}
