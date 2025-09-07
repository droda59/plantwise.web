'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSearchParams } from '@/api/plant-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantFilters } from '@/components/features/home/plant-filters';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';
import { genusApiInstance } from '@/api/genus-api';

export default function Home() {
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
        <div className='font-sans grid justify-items-center p-8 gap-16'>
            <main className='flex row-start-2 items-center'>
                {!loading &&
                    <div className='flex'>
                        <ul className='flex-col'>
                            {genusList?.map(g => (
                                <li>{g}</li>
                            ))}
                        </ul>
                    </div>
                }
            </main>
        </div>
    );
}
