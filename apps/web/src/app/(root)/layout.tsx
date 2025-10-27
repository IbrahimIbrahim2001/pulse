
import Providers from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FullscreenLayout from "./components/fullscreen-layout";
import AppSidebar from "./components/app-sidebar";

import "../../index.css";
import ModalProvider from "./context/modal-context";
import Modal from "./components/modal";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "pulse messenger",
    description: "pulse messaging app",
};


export default function RootLayout({
    children,
    sideList,
}: Readonly<{
    children: React.ReactNode;
    sideList: React.ReactNode,
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <ModalProvider>
                        <SidebarProvider defaultOpen={false}>
                            <AppSidebar />
                            <SidebarInset>
                                <main className="h-svh">
                                    <Modal />
                                    <FullscreenLayout>
                                        <div className="grid grid-cols-12">
                                            {sideList}
                                            {children}
                                        </div>
                                    </FullscreenLayout>
                                </main>
                            </SidebarInset>
                        </SidebarProvider>
                    </ModalProvider>
                </Providers>
            </body>
        </html>
    );
}
