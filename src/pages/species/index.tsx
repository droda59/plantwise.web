'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { IconSlash } from '@tabler/icons-react';
import { speciesApiInstance } from '@/api/species-api';
import { createSearchParams } from '@/api/plant-api';
import { Separator } from '@/components/ui/separator';
import { speciesFirstWord } from '@/lib/utils';

export default function SpeciesPage() {
    const [speciesList, setSpeciesList] = useState<Partial<Record<string, { genus: string, species: string, count: number }[]>>>();
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);

        const species = await speciesApiInstance.getSpecies();
        const groupedSpecies = Object.groupBy(species, ({ genus }) => genus);
        // Ensure each species object has a 'count' property
        const groupedSpeciesWithCount = Object.fromEntries(
            Object.entries(groupedSpecies).map(([genus, arr]) => [
                genus,
                (arr ?? []).map(s => ({
                    ...s,
                    count: s.count ?? 0, // or provide a default value if count is missing
                })),
            ])
        );
        setSpeciesList(groupedSpeciesWithCount);

        setLoading(false);
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                {!loading && (
                    <>
                        <Breadcrumb className='mb-4'>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/genus">Genres</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/#">Espèces</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex-col'>
                            <h1 className='text-3xl font-semibold'>Recherche par espèce</h1>
                            <div className='flex-col mt-8'>
                                {Object.entries(speciesList || {}).map(([key, values], i) =>
                                    key && (
                                        <div key={i}>
                                            <h1 className='text-xl font-semibold'>
                                                <Link href={`/genus/${key}`}><i>{key}</i></Link>
                                            </h1>
                                            <div className='grid grid-cols-2 mt-8'>
                                                {/* TODO Ajouter species vide pour chercher les Malus sp. */}
                                                {values?.map((s, j) => (
                                                    <div key={j}>
                                                        {!s.species && <Link key={j} href={`/search?${createSearchParams({ genus: s.genus }).toString()}`}><i>{s.genus} sp.</i> <span className='text-muted text-sm'>({s.count})</span></Link>}
                                                        {s.species && <Link key={j} href={`/search?${createSearchParams({ species: s.species }).toString()}`}><i>{speciesFirstWord(s.species)}</i> <span className='text-muted text-sm'>({s.count})</span></Link>}
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className='my-8' />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
