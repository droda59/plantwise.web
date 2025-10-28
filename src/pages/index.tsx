'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSearchParams } from '@/api/plant-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

    const changeFilters = (filters: Filters) => {
        setFilters(filters);
    };

    return (
        <div className='font-sans grid justify-items-center p-8 gap-16'>
            <main className='flex row-start-2 items-center'>
                <Card className="shadow-none" style={{ position: 'relative' }}>
                    <CardHeader>
                        <h1 className="text-lg">
                            <div className='flex items-center flex-col p-4'>
                                <span style={{
                                    fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
                                    fontWeight: 'normal',
                                    fontSize: '1.5em'
                                }}>
                                    <span style={{
                                        color: '#e2e5e8',
                                    }}>PLANT</span>
                                    <span style={{
                                        color: '#1180be',
                                    }}>FINDER</span>
                                </span>
                            </div>
                        </h1>
                        <CardTitle className='px-2'>Rechercher des plantes</CardTitle>
                        <CardDescription className='px-2'>
                            Entrer vos critères de recherche pour trouver les bons végétaux
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlantFilters filters={filters} onApplyFilters={applyFilters} onResetFilters={resetFilters} onChangeFilters={changeFilters} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
