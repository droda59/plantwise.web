'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { genusApiInstance } from '@/api/genus-api';
import { IconSlash } from '@tabler/icons-react';

export default function Home() {
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
                        <div className='flex'>
                            <ul className='flex-col'>
                                {speciesList?.map(g => (
                                    <li>
                                        <i>{g}</i>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
