'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

import { PlantCard, PlantListCard } from '@/components/features/search/plant-card';
import { IconSearch } from '@tabler/icons-react';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';
import { FilterSidebar } from "@/components/features/search/filter-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SectionTitle } from '@/components/section-title';
import "@/styles/globals.css";
import SearchLayout from './search-layout';
import { Spinner } from '@/components/ui/spinner';

function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [groups, setGroups] = useState<[string, Plant[] | undefined][]>();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        if (!searchParams) return;

        const heightMin = searchParams.get('heightMin');
        const heightMax = searchParams.get('heightMax');
        const spreadMin = searchParams.get('spreadMin');
        const spreadMax = searchParams.get('spreadMax');
        const height: [number, number] = [0, 3000];
        const spread: [number, number] = [0, 3000];
        if (heightMin) height[0] = parseInt(heightMin as string, 10);
        if (heightMax) height[1] = parseInt(heightMax as string, 10);
        if (spreadMin) spread[0] = parseInt(spreadMin as string, 10);
        if (spreadMax) spread[1] = parseInt(spreadMax as string, 10);

        setFilters({
            q: searchParams.get('q') || DEFAULT_FILTERS.q,
            zone: searchParams.get('zone') || DEFAULT_FILTERS.zone,
            sunConditions: searchParams.get('sun') || DEFAULT_FILTERS.sunConditions,
            // droughtTolerant: searchParams.get('droughtTolerant') ? true : DEFAULT_FILTERS.droughtTolerant,
            // floodTolerant: searchParams.get('floodTolerant') ? true : DEFAULT_FILTERS.floodTolerant,

            type: searchParams.get('type') || DEFAULT_FILTERS.type,
            functionalGroup: searchParams.get('functionalGroup') || DEFAULT_FILTERS.functionalGroup,
            bloom: searchParams.get('bloom') || DEFAULT_FILTERS.bloom,
            height,
            spread,
            native: searchParams.get('native') ? true : DEFAULT_FILTERS.native,

            genus: searchParams.get('genus') || undefined,
            species: searchParams.get('species') || undefined,
        });
    }, [searchParams]);

    const fetchPlants = async (filters?: Filters) => {
        setLoading(true);
        setFilteredPlants([]);

        const data = await plantApiInstance.getPlants(filters);

        const groupedSpeciesObj = Object.groupBy(data, d => d.species ?? 'unknown');
        const groupedSpecies = Object.entries(groupedSpeciesObj);
        setGroups(groupedSpecies);

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
                <div className="@container/main gap-2 items-center px-6 overflow-auto block">
                    <div className="flex flex-col gap-6 py-6 w-full">
                        <SectionTitle title='Résultats' icon={IconSearch}>
                            <div className='flex items-center text-sm text-muted-foreground'>
                                {loading ?
                                    <>
                                        <Spinner className='mr-1' />
                                        <p>Chargement des résultats...</p>
                                    </>
                                    : <p>{`${filteredPlants.length} plante${filteredPlants.length > 1 ? 's' : ''} trouvée${filteredPlants.length > 1 ? 's' : ''}`}</p>
                                }
                            </div>
                        </SectionTitle>

                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-lg'>
                                <div className="flex items-center">
                                    <Spinner className='mr-2' />
                                    <span>Chargement des résultats, veuillez patienter...</span>
                                </div>
                            </motion.div>
                        ) : !filteredPlants.length ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-lg'>
                                Aucune plante ne correspond. Essayez d'élargir les filtres.
                            </motion.div>
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                <div className='grid gap-4 grid-cols-2'>
                                    {groups?.map(([key, values]) =>
                                        values?.length && values?.length <= 1
                                            ? <PlantCard key={key} plant={values[0]} />
                                            : values && <PlantListCard key={key} plants={values} />
                                    )}
                                </div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

SearchPage.getLayout = (page: any) => {
    return <SearchLayout>{page}</SearchLayout>
};

export default SearchPage;