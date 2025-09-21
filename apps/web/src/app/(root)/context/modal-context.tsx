'use client';

import { createContext, useContext, useState } from 'react';

interface ModalContextType {
    isOpen: boolean,
    openModal: () => void,
    closeModal: () => void,
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}