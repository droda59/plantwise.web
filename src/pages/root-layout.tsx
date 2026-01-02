"use client";

import { ProjectProvider } from "@/components/project-context";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProjectProvider>
            <Toaster theme="dark" />
            <SiteHeader />
            {children}
        </ProjectProvider>
    );
}
