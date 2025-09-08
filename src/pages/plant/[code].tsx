'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ExternalLink, MapPin } from 'lucide-react';

import { plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { getPlantType, PlantType, PlantTypeValue } from "@/types/plantType";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowsHorizontal, IconArrowsVertical, IconSlash, IconWorld } from "@tabler/icons-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CodeChip } from '@/components/code-chip';
import { FunctionalGroup, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const VSeparator = () => (
    <Separator
        orientation="vertical"
        className="mr-4 data-[orientation=vertical]:h-4"
    />
);

const HoverCardFunctionalGroup = ({ children, group }) => (
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
);

const HoverCardNative = ({ children }) => (
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
);

const HoverCardNaturalized = ({ children }) => (
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
);

const SizeChip = ({ size }: { size?: number }) => {
    if (!size) return <span>Inconnue</span>;
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

export default function PlantPage() {
    const router = useRouter();

    const { code } = router.query;
    const plantCode = code as string;

    const [plant, setPlant] = useState<Plant>();
    const [type, setType] = useState<PlantType>();
    const [latin, setLatin] = useState<string>();
    const [cultivar, setCultivar] = useState<string>();
    const [functionalGroup, setFunctionalGroup] = useState<FunctionalGroup | undefined>();
    const [loading, setLoading] = useState(false);

    const fetchPlant = async () => {
        if (plantCode) {
            setLoading(true);

            const data = await plantApiInstance.getPlant(plantCode);

            setPlant(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, [router.query]);

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
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                {!loading && !!plant && (
                    <>
                        <Breadcrumb className='mb-4'>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/search">Recherche</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#"><i>{latin}</i></BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <Card className="shadow-none rounded-xs" style={{ position: 'relative' }}>
                            <CardHeader className="">
                                {type && <h2 className='text-lg text-muted-foreground'>{type.label}</h2>}
                                <div className='flex mt-2'>
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
                                <div className='flex w-full mt-4 mb-2'>
                                    <Badge className='flex grow items-center overflow-hidden p-4 mr-2 rounded-sm' variant='outline'>
                                        <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconWorld /></div>
                                        <div className='flex-col grow'>
                                            <div className="font-light text-xs">Zone</div>
                                            <div className="font-medium text-lg">{plant.zone || 'Inconnue'}</div>
                                        </div>
                                    </Badge>
                                    <Badge className='flex grow items-center overflow-hidden p-4 mx-2 rounded-sm' variant='outline'>
                                        <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconArrowsVertical /></div>
                                        <div className='flex-col grow'>
                                            <div className="font-light text-xs">Hauteur</div>
                                            <div className="font-medium text-lg"><SizeChip size={plant.height} /></div>
                                        </div>
                                    </Badge>
                                    <Badge className='flex grow items-center overflow-hidden p-4 ml-2 rounded-sm' variant='outline'>
                                        <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconArrowsHorizontal /></div>
                                        <div className='flex-col grow'>
                                            <div className="font-light text-xs">Largeur</div>
                                            <div className="font-medium text-lg"><SizeChip size={plant.spread} /></div>
                                        </div>
                                    </Badge>
                                </div>
                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Informations générales
                                    </div>

                                    <table className="table-auto w-full mt-4 text-ms">
                                        <tbody>
                                            {plant.isNative && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Statut</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <HoverCardNative>
                                                            <span className='cursor-help'>Indigène</span>
                                                        </HoverCardNative>
                                                    </td>
                                                </tr>
                                            )}
                                            {plant.isNaturalized && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Statut</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <HoverCardNaturalized>
                                                            <span className='cursor-help'>Naturalisé</span>
                                                        </HoverCardNaturalized>
                                                    </td>
                                                </tr>
                                            )}
                                            {!!functionalGroup && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Groupe fonctionnel</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <HoverCardFunctionalGroup group={functionalGroup}>
                                                            <span className='cursor-help'>{functionalGroup.value} - {functionalGroup.label}</span>
                                                        </HoverCardFunctionalGroup>
                                                    </td>
                                                </tr>
                                            )}
                                            {!!plant.family && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Famille</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <i>{plant.family}</i>
                                                    </td>
                                                </tr>
                                            )}
                                            {!!plant.genus && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Genre</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <i>{plant.genus}</i>
                                                    </td>
                                                </tr>
                                            )}
                                            {!!plant.species && (
                                                <tr>
                                                    <td className='p-1 pl-2 text-sm'>Espèce</td>
                                                    <td className='flex items-center'>
                                                        <VSeparator />
                                                        <i>{plant.species}</i>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/*
                                <div className="flex flex-wrap gap-2">
                                    {plant.nurseries.map((n, i) => <NurseryChip key={n.name + i} n={n} />)}
                                </div>
                                 */}
                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Images
                                    </div>

                                    <iframe id='images' width='100%' height='600' src={`https://www.bing.com/images/search?q=${plant.name}`} />
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
        </div>
    );
}
