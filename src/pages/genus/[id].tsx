'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { genusApiInstance } from '@/api/genus-api';
import { IconSearch, IconSlash } from '@tabler/icons-react';
import { createSearchParams } from '@/api/plant-api';
import Link from 'next/link';
import { speciesFirstWord } from '@/lib/utils';
import { SearchInput } from '@/components/search-input';

type SpeciesGroup = { species: string | undefined, count: number };

export default function GenusPage() {
    const router = useRouter();

    const { id } = router.query;
    const genus = id as string;

    const [speciesList, setSpeciesList] = useState<SpeciesGroup[]>();
    const [filteredList, setFilteredList] = useState<SpeciesGroup[]>();
    const [textFilter, setTextFilter] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const fetchSpecies = async () => {
        if (genus) {
            setLoading(true);

            const data = await genusApiInstance.getSpecies(genus);

            setSpeciesList(data);

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecies();
    }, [router.query]);

    useEffect(() => {
        if (speciesList?.length) {
            setFilteredList(speciesList);
        }
    }, [speciesList]);

    useEffect(() => {
        const filteredSpecies = speciesList?.filter(g => g.species?.toUpperCase().includes(textFilter.toUpperCase()));
        setFilteredList(filteredSpecies);
    }, [textFilter]);

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                {!loading && !!genus && (
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
                                    <BreadcrumbLink href="#"><i>{genus}</i></BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex-col'>
                            <h1 className='text-xl font-semibold'>{genus}</h1>

                            <div className='mt-8'>
                                <SearchInput className='grid grid-cols-4' setFilter={setTextFilter} filter={textFilter} />
                            </div>

                            <div className='grid grid-cols-2 mt-8'>
                                {filteredList?.map((s, i) => (
                                    <div key={i}>
                                        {!s.species?.length && <span key={i}><i>{genus} sp.</i> <span className='text-muted text-sm'>({s.count})</span></span>}
                                        {!!s.species?.length &&
                                            <Link key={i} className='flex items-center hover:underline' href={`/search?${createSearchParams({ species: s.species }).toString()}`}>
                                                <IconSearch className="w-4 h-4 opacity-40 mr-2" />
                                                <i>{speciesFirstWord(s.species)}</i>&nbsp;<span className='text-muted text-sm'>({s.count})</span>
                                            </Link>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
