"use client";

import { ProjectProvider } from "@/components/project-context";
import { SiteHeader } from "@/components/site-header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProjectProvider>
            <SiteHeader />
            {children}
        </ProjectProvider>
    );
}
