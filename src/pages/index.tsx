'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlantFilters } from '@/components/features/home/plant-filters';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';

export default function Home() {
    const router = useRouter();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

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
                        <PlantFilters filters={filters} onApplyFilters={applyFilters} onResetFilters={resetFilters} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
