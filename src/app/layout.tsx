"use client";

import React from 'react';
import '@/styles/globals.css';

import { ProjectProvider } from "@/components/project-context";
import { SiteHeader } from "@/components/site-header";

export default function Layout({
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
