'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantCard } from '@/components/plant-card';
import { plantApiInstance } from '@/api/plant-api';

import { FilterSidebar } from "@/components/filter-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { IconSearch } from '@tabler/icons-react';
import { SectionTitle } from '@/components/section-title';
import { Filters } from '@/types/filters';
import { useRouter } from 'next/router';
import { Plant } from '@/types/plant';

export default function Page({ params }) {
    const router = useRouter();

    console.log(router);
    const { code } = router.query;
    if (!code) return;

    const plantCode = code as string;
    const [plant, setPlant] = useState<Plant>();
    const [loading, setLoading] = useState(false);

    const fetchPlant = async (filters?: Filters) => {
        setLoading(true);

        const data = await plantApiInstance.getPlant(plantCode);

        setPlant(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPlant();
    }, []);

    return (
        <div>
            {!loading && !!plant && (
                <div>
                    {plant.latin}
                </div>
            )}
        </div>
    );
}
