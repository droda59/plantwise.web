"use client";

import React from 'react';
import '@/styles/globals.css';

import { ProjectProvider } from "@/components/project-context";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({
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
