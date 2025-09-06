import { AppSidebar } from "@/app/(root)/_components/app-sidebar";
import Providers from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FullscreenLayout from "./_components/fullscreen-layout";

import "../../index.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "pulse",
    description: "pulse",
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
                    <SidebarProvider defaultOpen={false}>
                        <AppSidebar />
                        <SidebarInset>
                            <main className="h-svh">
                                <FullscreenLayout>
                                    <div className="flex">
                                        {sideList}
                                        {children}
                                    </div>
                                </FullscreenLayout>
                            </main>
                        </SidebarInset>
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    );
}
