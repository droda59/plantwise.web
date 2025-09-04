'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

import { PlantCard } from '@/components/plant-card';
import { IconSearch } from '@tabler/icons-react';

import { plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';
import { FilterSidebar } from "@/components/filter-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SectionTitle } from '@/components/section-title';
import "@/styles/globals.css";

export default function Page() {
    const searchParams = useSearchParams();
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    
    useEffect(() => {
        if (!searchParams) return;

        setFilters({
            q: searchParams.get('q') || DEFAULT_FILTERS.q,
            type: searchParams.get('type') || DEFAULT_FILTERS.type,
            zone: searchParams.get('zone') || DEFAULT_FILTERS.zone,
            native: searchParams.get('native') ? true : DEFAULT_FILTERS.native,
            droughtTolerant: searchParams.get('droughtTolerant') ? true : DEFAULT_FILTERS.droughtTolerant,
            floodTolerant: searchParams.get('floodTolerant') ? true : DEFAULT_FILTERS.floodTolerant,
            functionalGroup: searchParams.get('functionalGroup') || DEFAULT_FILTERS.functionalGroup,
            height: searchParams.get('heightMin') && searchParams.get('heightMax')
                ? [parseInt(searchParams.get('heightMax') as string, 10) / 100, parseInt(searchParams.get('heightMax') as string, 10) / 100]
                : DEFAULT_FILTERS.height,
            spread: searchParams.get('spreadMin') && searchParams.get('spreadMax')
                ? [parseInt(searchParams.get('spreadMax') as string, 10) / 100, parseInt(searchParams.get('spreadMax') as string, 10) / 100]
                : DEFAULT_FILTERS.height,
        });
    }, [searchParams]);

    const fetchPlants = async (filters?: Filters) => {
        setFilteredPlants([]);
        setLoading(true);

        const data = await plantApiInstance.getPlants(filters);

        setFilteredPlants(data);
        setLoading(false);
    };

    useEffect(() => {
        const isDefaultFilters = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

        if (!isDefaultFilters) {
            fetchPlants(filters);
        }
    }, [filters]);

    const applyFilters = (filters: Filters) => fetchPlants(filters);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 80)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <FilterSidebar filters={filters} variant="inset" onApplyFilters={applyFilters} />
            <SidebarInset>
                <SiteHeader />
                <div className="@container/main flex gap-2 flex  items-center px-6">
                    <div className="flex flex-col gap-6 py-6 w-full">
                        <SectionTitle title='Résultats' icon={IconSearch} subtitle={loading
                            ? 'Chargement des plantes...'
                            : `${filteredPlants.length} plante${filteredPlants.length > 1 ? 's' : ''} trouvée${filteredPlants.length > 1 ? 's' : ''}`
                        } />

                        {!loading &&
                            <AnimatePresence mode='popLayout'>
                                <div className='grid gap-4 grid-cols-2'>
                                    {filteredPlants.map((plant, index) => (
                                        <PlantCard key={index} plant={plant} />
                                    ))}
                                    {filteredPlants.length === 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-sm text-muted-foreground'>
                                            Aucune plante ne correspond. Essayez d'élargir les filtres.
                                        </motion.div>
                                    )}
                                </div>
                            </AnimatePresence>
                        }
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
