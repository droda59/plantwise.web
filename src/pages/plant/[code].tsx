'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { plantApiInstance } from '@/api/plant-api';
import { Filters } from '@/types/filters';
import { Nursery, Plant } from '@/types/plant';
import { getPlantType, PlantType, PlantTypeValue } from "@/types/plantType";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CodeChip } from '@/components/code-chip';
import { FunctionalGroup, getFunctionalGroup } from '@/types/functional-groups';
import { ExternalLink, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NurseryChip = ({ n }: { n: Nursery }) => (
    <a href={n.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs rounded-full border px-2 py-1 hover:shadow-sm transition">
        <MapPin className="w-3 h-3" />
        <span>{n.name}</span>
        <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
);

function HoverCardFunctionalGroup({ children, group }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className={`w-80 border-${group.color} rounded-sm`}>
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Groupe {group.value}</h4>
                        <p className="text-sm">
                            {group.description}
                        </p>
                        <div className="text-muted-foreground text-xs">
                            {group.species}
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
                            Plante qui pousse dans une zone donnée de l’aire de répartition globale de son espèce, sans intervention humaine.
                            <br />
                            En Amérique du Nord, on fait référence aux espèces qui existaient sur le continent avant la colonisation européenne.
                        </p>
                        <div className="text-muted-foreground text-xs">
                            Source: Aiglon Indigo
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
                            Plante bien établie dans une zone différente de l’aire de répartition globale de son espèce après y avoir été introduite dans le cadre d’activités humaines et qui est en mesure de survivre et de se reproduire sans aide.
                        </p>
                        <div className="text-muted-foreground text-xs">
                            Source: Aiglon Indigo
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
    const [functionalGroup, setFunctionalGroup] = useState<FunctionalGroup | undefined>();
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
        setFunctionalGroup(getFunctionalGroup(plant.functionalGroup));

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
                            {type && <h2 className='text-lg text-muted-foreground'>{type.label}</h2>}
                            <div className='flex'>
                                <CodeChip plant={plant} />
                                <div className="grow ml-4">
                                    <CardTitle className="text-3xl">
                                        <h1>
                                            <span className='italic'>{latin}</span>
                                            {cultivar && <span>&nbsp;'{cultivar}'</span>}
                                        </h1>
                                    </CardTitle>
                                    <CardDescription>
                                        <h3>
                                            {plant.name}
                                        </h3>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid">
                            <div className='flex w-full'>
                                <Badge className='flex grow items-center overflow-hidden p-4 m-2 rounded-sm' variant='outline'>
                                    <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconWorld /></div>
                                    <div className='flex-col grow'>
                                        <div className="font-light text-xs">Zone</div>
                                        <div className="font-medium text-lg">{plant.zone || 'Inconnue'}</div>
                                    </div>
                                </Badge>
                                <Badge className='flex grow items-center overflow-hidden p-4 m-2 rounded-sm' variant='outline'>
                                    <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconArrowsVertical /></div>
                                    <div className='flex-col grow'>
                                        <div className="font-light text-xs">Hauteur</div>
                                        <div className="font-medium text-lg"><SizeChip size={plant.height} /></div>
                                    </div>
                                </Badge>
                                <Badge className='flex grow items-center overflow-hidden p-4 m-2 rounded-sm' variant='outline'>
                                    <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconArrowsHorizontal /></div>
                                    <div className='flex-col grow'>
                                        <div className="font-light text-xs">Largeur</div>
                                        <div className="font-medium text-lg"><SizeChip size={plant.spread} /></div>
                                    </div>
                                </Badge>
                            </div>
                            <div className='flex-col mt-8'>
                                <div className='text-xl font-semibold'>
                                    Informations générales
                                </div>

                                <table className="table-auto w-full mt-4 text-ms">
                                    <tbody>
                                        {plant.isNative && (
                                            <tr>
                                                <td className='p-1 pl-2'>Statut</td>
                                                <td>
                                                    <HoverCardNative>
                                                        <span className='cursor-help'>Indigène</span>
                                                    </HoverCardNative>
                                                </td>
                                            </tr>
                                        )}
                                        {plant.isNaturalized && (
                                            <tr>
                                                <td className='p-1 pl-2'>Statut</td>
                                                <td>
                                                    <HoverCardNative>
                                                        <span className='cursor-help'>Naturalisé</span>
                                                    </HoverCardNative>
                                                </td>
                                            </tr>
                                        )}
                                        {!!functionalGroup && (
                                            <tr>
                                                <td className='p-1 pl-2'>Groupe fonctionnel</td>
                                                <td>
                                                    <HoverCardFunctionalGroup group={functionalGroup}>
                                                        <span className='cursor-help'>{functionalGroup.value} - {functionalGroup.label}</span>
                                                    </HoverCardFunctionalGroup>
                                                </td>
                                            </tr>
                                        )}
                                        {!!plant.family && (
                                            <tr>
                                                <td className='p-1 pl-2'>Famille</td>
                                                <td><i>{plant.family}</i></td>
                                            </tr>
                                        )}
                                        {!!plant.genus && (
                                            <tr>
                                                <td className='p-1 pl-2'>Genre</td>
                                                <td><i>{plant.genus}</i></td>
                                            </tr>
                                        )}
                                        {!!plant.species && (
                                            <tr>
                                                <td className='p-1 pl-2'>Espèce</td>
                                                <td><i>{plant.species}</i></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
