"use client";

import { ProjectProvider } from '@/components/project-context';
import { SiteHeader } from '@/components/site-header';
import '@/styles/globals.css';
import { Toaster } from "@/components/ui/sonner";

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProjectProvider>
            <Toaster theme="dark" />
            <SiteHeader className='fixed w-full' />
            {children}
        </ProjectProvider>
    )
}
