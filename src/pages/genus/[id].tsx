'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { genusApiInstance } from '@/api/genus-api';
import { IconSlash } from '@tabler/icons-react';
import { createSearchParams } from '@/api/plant-api';
import Link from 'next/link';

export default function GenusPage() {
    const router = useRouter();

    const { id } = router.query;
    const genus = id as string;

    const [loading, setLoading] = useState(false);
    const [speciesList, setSpeciesList] = useState<string[]>();

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
                            <div className='grid grid-cols-2 mt-8'>
                                {speciesList?.map((s, i) => (
                                    <>
                                        {!s.length && <span><i>{genus} sp.</i></span>}
                                        {!!s.length && <Link key={i} href={`/search?${createSearchParams({ species: s }).toString()}`}><i>{s}</i></Link>}
                                    </>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
