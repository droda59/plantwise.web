'use client';

import React, { useEffect, useState } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { genusApiInstance } from '@/api/genus-api';
import { IconSlash } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchInput } from '@/components/search-input';

type GenusGroup = { genus: string, count: number };

export default function GenusListPage() {
    const [genusList, setGenusList] = useState<GenusGroup[]>();
    const [filteredList, setFilteredList] = useState<GenusGroup[]>();
    const [textFilter, setTextFilter] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);

        const genus = await genusApiInstance.getGenus();
        setGenusList(genus);

        setLoading(false);
    };

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        if (genusList?.length) {
            setFilteredList(genusList);
        }
    }, [genusList]);

    useEffect(() => {
        const filteredGenus = genusList?.filter(g => g.genus.toUpperCase().includes(textFilter.toUpperCase()));
        setFilteredList(filteredGenus);
    }, [textFilter]);

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
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex-col'>
                            <h1 className='text-3xl font-semibold'>Recherche par genre</h1>

                            <div className='mt-8'>
                                <SearchInput className='grid grid-cols-4' setFilter={setTextFilter} filter={textFilter} />
                            </div>

                            <div className='grid grid-cols-2 mt-8'>
                                {filteredList?.map((g, i) => g && !!g.genus.length && (
                                    <Link key={i} href={`/genus/${g.genus}`}><i>{g.genus}</i> <span className='text-muted text-sm'>({g.count})</span></Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
