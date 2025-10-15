'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { getPlantType, PlantType } from "@/types/plantType";
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
import { getHardinessZone, HardinessZone } from '@/types/hardiness-zone';
import { SizeChip } from '@/components/size-chip';
import { formatMonthChip, speciesFirstWord } from '@/lib/utils';

const sunToleranceMap = {
    full: 'Plein soleil',
    partial: 'Mi-ombre',
    shade: 'Ombre'
};

const VSeparator = () => (
    <Separator
        orientation="vertical"
        className="mr-4 data-[orientation=vertical]:h-4"
    />
);

const HoverCardHardinessZone = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className='w-180 rounded-sm'>
            <div className="flex justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Zones de rusticité</h4>
                    <div className='flex'>
                        <Image
                            src='/carte-zones-rusticite-quebec-plantes.jpg'
                            width={300}
                            height={200}
                            alt='Carte des zones de rusticité' />
                        <div className='ml-2'>
                            <p className="text-sm">
                                La rusticité est une cote attribuée aux plantes vivaces basée sur leur capacité à résister au froid.
                                <br />
                                Les zones sont classées de 0 à 9 en fonction de diverses conditions climatiques, comme la température, les précipitations et la durée de la période de gel.
                                <br />
                                <br />
                                La zone 0 couvre les régions les plus froides du nord du pays, la zone 9 couvre les parties les plus chaudes de l'île de Vancouver.
                            </p>
                            <div className="mt-2 text-muted-foreground text-xs">
                                Source : Gouvernement du Canada
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard >
);

const HoverCardPlantZone = ({ children, zone }: { children: React.ReactNode, zone?: HardinessZone }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        {!!zone && (
            <HoverCardContent className={`w-80 border-${zone.colorHex} rounded-sm`}>
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Zone de rusticité {zone.value}</h4>
                        <p className="text-sm">
                            {zone.label}
                        </p>
                        <div className="mt-2 text-muted-foreground text-xs">
                            Source : Gouvernement du Canada
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        )}
    </HoverCard>
);

const HoverCardFunctionalGroup = ({ children, group }: { children: React.ReactNode, group: FunctionalGroup }) => (
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
                    <div className="text-xs">
                        ex. {group.species}
                    </div>
                    <div className="mt-2 text-muted-foreground text-xs">
                        Source : Jour de la Terre
                    </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
);

const HoverCardNative = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-sm">
            <div className="flex justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Plante indigène</h4>
                    <p className="text-sm">
                        Plante qui pousse dans une zone donnée de l'aire de répartition globale de son espèce, sans intervention humaine.
                        <br />
                        En Amérique du Nord, on fait référence aux espèces qui existaient sur le continent avant la colonisation européenne.
                    </p>
                    <div className="mt-2 text-muted-foreground text-xs">
                        Source : Aiglon Indigo
                    </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
);

const HoverCardNaturalized = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-sm">
            <div className="flex justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Plante naturalisée</h4>
                    <p className="text-sm">
                        Plante bien établie dans une zone différente de l'aire de répartition globale de son espèce après y avoir été introduite dans le cadre d'activités humaines et qui est en mesure de survivre et de se reproduire sans aide.
                    </p>
                    <div className="mt-2 text-muted-foreground text-xs">
                        Source : Aiglon Indigo
                    </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
);

const GeneralInfoRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <tr>
        <td className='p-1 pl-2 text-sm'>{label}</td>
        <td className='flex items-center'>
            <VSeparator />
            {children}
        </td>
    </tr>
);

export default function PlantPage() {
    const router = useRouter();

    const { code } = router.query;
    const plantCode = code as string;

    const [zone, setZone] = useState<HardinessZone | undefined>();
    const [plant, setPlant] = useState<Plant | null>();
    const [type, setType] = useState<PlantType>();
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

        setZone(getHardinessZone(plant.zone));
        setType(getPlantType(plant.type));
        setFunctionalGroup(getFunctionalGroup(plant.functionalGroup));
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
                                    <BreadcrumbLink href="#"><i>{plant.species || plant.genus}</i></BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <Card className="shadow-none rounded-xs relative">
                            <CardHeader className="">
                                {type && <h2 className='text-lg text-muted-foreground'>{type.label}</h2>}
                                <div className='flex mt-2'>
                                    <CodeChip plant={plant} />
                                    <div className="grow ml-4">
                                        <CardTitle className="text-3xl">
                                            <h1>
                                                <span className='italic'>{plant.species || plant.genus}</span>
                                                {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
                                                {plant.note && <span>&nbsp;({plant.note})</span>}
                                            </h1>
                                        </CardTitle>
                                        <CardDescription>
                                            <h3>
                                                {plant.synonym && <div className="text-sm text-muted-foreground">syn.&nbsp;<span className='italic'>{plant.synonym}</span></div>}
                                                {plant.commonName && <div className="text-sm text-muted-foreground">{plant.commonName}</div>}
                                            </h3>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid">
                                <div className='flex w-full mt-4 mb-2'>
                                    <Badge className='flex grow items-center overflow-hidden p-4 pr-1 mr-2 rounded-sm' variant='outline'>
                                        <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconWorld /></div>
                                        <div className='flex-col grow'>
                                            <HoverCardHardinessZone>
                                                <div className="font-light text-xs cursor-help">Zone de rusticité</div>
                                            </HoverCardHardinessZone>
                                            <HoverCardPlantZone zone={zone}>
                                                <div className="flex items-center font-medium text-lg cursor-help">
                                                    <Separator
                                                        orientation="vertical"
                                                        className='mr-2 data-[orientation=vertical]:h-4'
                                                        style={{
                                                            backgroundColor: zone?.colorHex,
                                                            width: '8px'
                                                        }}
                                                    />
                                                    {zone?.value || 'Inconnue'}
                                                </div>
                                            </HoverCardPlantZone>
                                        </div>
                                    </Badge>
                                    <Badge className='flex grow items-center overflow-hidden p-4 pr-1 mx-2 rounded-sm' variant='outline'>
                                        <div className='flex grow [&>svg]:size-8 [&>svg]:shrink-0'><IconArrowsVertical /></div>
                                        <div className='flex-col grow'>
                                            <div className="font-light text-xs">Hauteur</div>
                                            <div className="font-medium text-lg"><SizeChip size={plant.height} /></div>
                                        </div>
                                    </Badge>
                                    <Badge className='flex grow items-center overflow-hidden p-4 pr-1 ml-2 rounded-sm' variant='outline'>
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
                                                <GeneralInfoRow label='Statut'>
                                                    <HoverCardNative>
                                                        <span className='cursor-help'>Indigène</span>
                                                    </HoverCardNative>
                                                </GeneralInfoRow>
                                            )}
                                            {plant.isNaturalized && (
                                                <GeneralInfoRow label='Statut'>
                                                    <HoverCardNaturalized>
                                                        <span className='cursor-help'>Naturalisé</span>
                                                    </HoverCardNaturalized>
                                                </GeneralInfoRow>
                                            )}
                                            {!!functionalGroup && (
                                                <GeneralInfoRow label='Groupe fonctionnel'>
                                                    <HoverCardFunctionalGroup group={functionalGroup}>
                                                        <span className='cursor-help'>{functionalGroup.value} - {functionalGroup.label}</span>
                                                    </HoverCardFunctionalGroup>
                                                </GeneralInfoRow>
                                            )}
                                            {!!plant.sunTolerance?.length && (
                                                <GeneralInfoRow label='Tolérance au soleil'>
                                                    <span>{plant.sunTolerance.map(s => sunToleranceMap[s]).join(', ')}</span>
                                                </GeneralInfoRow>
                                            )}
                                            {!!plant.bloom?.length && (
                                                <GeneralInfoRow label='Floraison'>
                                                    <span>{plant.bloom.map(b => formatMonthChip(b)).join(', ')}</span>
                                                </GeneralInfoRow>
                                            )}
                                            {!!plant.family && (
                                                <GeneralInfoRow label='Famille'>
                                                    <i>{plant.family}</i>
                                                </GeneralInfoRow>
                                            )}
                                            {!!plant.genus && (
                                                <GeneralInfoRow label='Genre'>
                                                    <Link href={`/genus/${plant.genus}`}><i>{plant.genus}</i></Link>
                                                </GeneralInfoRow>
                                            )}
                                            {!!plant.species && (
                                                <GeneralInfoRow label='Espèce'>
                                                    <Link href={`/search?${createSearchParams({ species: plant.species }).toString()}`}><i>{speciesFirstWord(plant.species)}</i></Link>
                                                </GeneralInfoRow>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Plus d'informations
                                    </div>
                                    <div className='mt-4'>
                                        <div className='text-ms'>
                                            {plant.vascanID && <Link className='font-medium text-blue-600 dark:text-blue-500 hover:underline' href={`https://data.canadensys.net/vascan/taxon/${plant.vascanID}`} target='_blank'>Base de données des plantes vasculaires du Canada (VASCAN)</Link>}
                                        </div>
                                    </div>
                                </div>

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
