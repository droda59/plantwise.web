'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantCard } from '@/components/plant-card';
import { Plant } from '@/types/plant';
import { plantApiInstance } from '@/api/plant-api';

import { FilterSidebar } from "@/components/filter-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSearch } from '@tabler/icons-react';
import { SectionTitle } from '@/components/section-title';
import { Filters } from '@/types/filters';
import Link from 'next/link';
import { PlantFilters } from '@/components/plant-filters';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const applyFilters = (filters: Filters) => router.push('/search');

    return (
        <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
            <main className='flex flex-col gap-[32px] row-start-2 items-center '>
                <Card className="shadow-sm hover:shadow-md transition rounded-xs" style={{ position: 'relative' }}>
                    <CardHeader className="pb-2">
                        <SiteHeader />
                    </CardHeader>
                    <CardContent className="grid">
                        <main className='flex items-center '>
                            <PlantFilters onApplyFilters={applyFilters} />
                        </main>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
