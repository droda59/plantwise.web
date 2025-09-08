'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

import { PlantCard } from '@/components/plant-card';
import { IconSearch } from '@tabler/icons-react';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';
import { FilterSidebar } from "@/components/features/search/filter-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SectionTitle } from '@/components/section-title';
import "@/styles/globals.css";
import SearchLayout from './search-layout';

function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        if (!searchParams) return;

        const heightMin = searchParams.get('heightMin');
        const heightMax = searchParams.get('heightMax');
        const spreadMin = searchParams.get('spreadMin');
        const spreadMax = searchParams.get('spreadMax');
        const height = [0, 3000];
        const spread = [0, 3000];
        if (heightMin) height[0] = parseInt(heightMin as string, 10);
        if (heightMax) height[1] = parseInt(heightMax as string, 10);
        if (spreadMin) spread[0] = parseInt(spreadMin as string, 10);
        if (spreadMax) spread[1] = parseInt(spreadMax as string, 10);

        setFilters({
            q: searchParams.get('q') || DEFAULT_FILTERS.q,
            type: searchParams.get('type') || DEFAULT_FILTERS.type,
            zone: searchParams.get('zone') || DEFAULT_FILTERS.zone,
            native: searchParams.get('native') ? true : DEFAULT_FILTERS.native,
            droughtTolerant: searchParams.get('droughtTolerant') ? true : DEFAULT_FILTERS.droughtTolerant,
            floodTolerant: searchParams.get('floodTolerant') ? true : DEFAULT_FILTERS.floodTolerant,
            functionalGroup: searchParams.get('functionalGroup') || DEFAULT_FILTERS.functionalGroup,
            height,
            spread,
            genus: searchParams.get('genus') || undefined,
            species: searchParams.get('species') || undefined,
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

    const applyFilters = (filters: Filters) => {
        const params = createSearchParams(filters);
        const query = filters && `?${params.toString()}` || '';

        router.push(`/search${query}`);
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 80)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <FilterSidebar filters={filters} variant="inset" onApplyFilters={applyFilters} onResetFilters={resetFilters} />
            <SidebarInset>
                <SiteHeader />
                <div className="@container/main flex gap-2 flex  items-center px-6">
                    <div className="flex flex-col gap-6 py-6 w-full">
                        <SectionTitle title='Résultats' icon={IconSearch} subtitle={loading
                            ? 'Chargement des plantes...'
                            : `${filteredPlants.length} plante${filteredPlants.length > 1 ? 's' : ''} trouvée${filteredPlants.length > 1 ? 's' : ''}`
                        } />

                        {!filteredPlants.length && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-sm text-muted-foreground'>
                                Aucune plante ne correspond. Essayez d'élargir les filtres.
                            </motion.div>
                        )}

                        {!loading && filteredPlants.length > 0 &&
                            <AnimatePresence mode='popLayout'>
                                <div className='grid gap-4 grid-cols-2'>
                                    {filteredPlants.map((plant, index) => (
                                        <PlantCard key={index} plant={plant} />
                                    ))}
                                </div>
                            </AnimatePresence>
                        }
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

SearchPage.getLayout = (page) => {
    return <SearchLayout>{page}</SearchLayout>
};

export default SearchPage;