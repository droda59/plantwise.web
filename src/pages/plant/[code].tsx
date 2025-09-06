'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { plantApiInstance } from '@/api/plant-api';
import { Filters } from '@/types/filters';
import { Plant } from '@/types/plant';
import { getPlantType, PlantType, PlantTypeValue } from "@/types/plantType";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CodeChip } from '@/components/code-chip';

function HoverCardFunctionalGroup({ children, group }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Groupe {group}</h4>
                        <p className="text-md">
                            Titre du groupe
                        </p>
                        <p className="text-sm">
                            Explication du groupe
                        </p>
                        <div className="text-muted-foreground text-xs">
                            something
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

function HoverCardNative({ children }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Plante indigène</h4>
                        <p className="text-sm">
                            Description de ce qu'est une plante indigène.
                        </p>
                        <div className="text-muted-foreground text-xs">
                            Source
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

function HoverCardNaturalized({ children }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Plante naturalisée</h4>
                        <p className="text-sm">
                            Description de ce qu'est une plante naturalisée.
                        </p>
                        <div className="text-muted-foreground text-xs">
                            Source
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

const SizeChip = ({ size }: { size?: number }) => {
    if (!size) return <span>Inconnue</span>;
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

export default function Page() {
    const router = useRouter();

    const { code } = router.query;
    if (!code) return;

    const plantCode = code as string;
    const [plant, setPlant] = useState<Plant>();
    const [type, setType] = useState<PlantType>();
    const [latin, setLatin] = useState<string>();
    const [cultivar, setCultivar] = useState<string>();
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

    useEffect(() => {
        if (!plant) return;

        const originalName = plant.latin;
        const nameWithCultivar = plant.latin.split("'");

        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(plant.latin);

        setType(getPlantType(plant.type));

        if (nameWithCultivar.length > 1) {
            setCultivar(nameWithCultivar[1]);
            setLatin(nameWithCultivar[0].trim());
        } else if (matches) {
            setLatin(originalName.substring(0, originalName.indexOf('(')).trim());
        } else {
            setLatin(originalName);
        }
    }, [plant]);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <main className="w-full max-w-xl">
                {!loading && !!plant && (
                    <Card className="shadow-none rounded-xs" style={{ position: 'relative' }}>
                        <CardHeader className="pb-2">
                            <div className='flex'>
                                <div className="grow">
                                    <CardTitle className="text-lg">
                                        <span className='italic'>{latin}</span>
                                        {cultivar && <span>&nbsp;'{cultivar}'</span>}
                                    </CardTitle>
                                    <CardDescription>{plant.name}</CardDescription>
                                </div>
                                <CodeChip plant={plant} />
                            </div>
                        </CardHeader>
                        <CardContent className="grid">
                            <div className="flex mb-2">
                                {type && <Badge variant="secondary" className='rounded-xs'>{type.label}</Badge>}
                                {!!plant.functionalGroup && (
                                    <HoverCardFunctionalGroup group={plant.functionalGroup}>
                                        <Badge asChild variant='secondary' className='rounded-xs'>
                                            <Link href='#' className="ml-1 rounded-xs">Groupe&nbsp;{plant.functionalGroup}</Link>
                                        </Badge>
                                    </HoverCardFunctionalGroup>
                                )}
                                {plant.isNative && (
                                    <HoverCardNative>
                                        <Badge asChild variant='secondary' className='ml-1 bg-emerald-100 text-emerald-700 rounded-xs'>
                                            <Link href='#' className="ml-1 rounded-xs">Indigène</Link>
                                        </Badge>
                                    </HoverCardNative>
                                )}
                                {plant.isNaturalized && (
                                    <HoverCardNaturalized>
                                        <Badge asChild variant='secondary' className='ml-1 bg-amber-100 text-amber-700 rounded-xs'>
                                            <Link href='#' className="ml-1 rounded-xs">Naturalisé</Link>
                                        </Badge>
                                    </HoverCardNaturalized>
                                )}
                            </div>
                            <div className='text-sm text-muted-foreground grid grid-cols-2 mt-2'>
                                <div className='flex-col'>
                                    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                        <IconWorld />&nbsp;
                                        <span className="font-light">Zone</span>&nbsp;
                                        <span className="font-medium">{plant.zone || 'Inconnue'}</span>
                                    </div>
                                    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                        <IconArrowsVertical />&nbsp;
                                        <span className="font-light">Haut.</span>&nbsp;
                                        <span className="font-medium"><SizeChip size={plant.height} /></span>
                                    </div>
                                    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                        <IconArrowsHorizontal />&nbsp;
                                        <span className="font-light">Larg.</span>&nbsp;
                                        <span className="font-medium"><SizeChip size={plant.spread} /></span>
                                    </div>
                                </div>
                                <div className='flex-col'>
                                    <div className='flex'>
                                        <div className='flex-col'>
                                            {!!plant.family && <div className="font-light">Fam.</div>}
                                            {!!plant.genus && <div className="font-light">Genre</div>}
                                            {!!plant.species && <div className="font-light">Esp.</div>}
                                        </div>
                                        <div className='flex-col grow ml-4'>
                                            {!!plant.family && <div className="font-medium italic">{plant.family}</div>}
                                            {!!plant.genus && <div className="font-medium italic">{plant.genus}</div>}
                                            {!!plant.species && <div className="font-medium italic">{plant.species}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* {plant.nurseries.map((n, i) => <NurseryChip key={n.name + i} n={n} />)} */}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
