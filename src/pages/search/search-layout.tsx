"use client";

import { ProjectProvider } from '@/components/project-context';
import { SiteHeader } from '@/components/site-header';
import '@/styles/globals.css';

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProjectProvider>
            <SiteHeader className='fixed w-full' />
            {children}
        </ProjectProvider>
    )
}
