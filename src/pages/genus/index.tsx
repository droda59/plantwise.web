'use client';

import React, { useEffect, useState } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { genusApiInstance } from '@/api/genus-api';
import { IconSlash } from '@tabler/icons-react';
import Link from 'next/link';

export default function Genus() {
    const [genusList, setGenusList] = useState<string[]>();
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
                            <div className='grid grid-cols-2 mt-8'>
                                {genusList?.map((g, i) => (
                                    <>
                                        {!!g.length && (
                                            <Link key={i} href={`/genus/${g}`}><i>{g}</i></Link>
                                        )}
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
