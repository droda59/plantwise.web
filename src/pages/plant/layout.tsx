import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            page for plant
            {children}
        </div>
    );
}
