'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlantFilters } from '@/components/plant-filters';
import { Filters } from '@/types/filters';

export default function Home() {
    const router = useRouter();

    const applyFilters = (filters: Filters) => {
        const params = createSearchParams(filters);
        const query = filters && `?${params.toString()}` || '';

        router.push(`/search${query}`);
    };

    return (
        <div className='font-sans grid justify-items-center p-8 gap-16'>
            <main className='flex row-start-2 items-center '>
                <Card className="shadow-none rounded-xs" style={{ position: 'relative' }}>
                    <CardHeader className="pb-2">
                        <SiteHeader />
                    </CardHeader>
                    <CardContent className="grid">
                        <PlantFilters onApplyFilters={applyFilters} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
