'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { createSearchParams, plantApiInstance } from '@/api/plant-api';
import { Plant } from '@/types/plant';
import { getPlantType, PlantType } from "@/types/plant-type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowsHorizontal, IconArrowsVertical, IconExternalLink, IconLeaf, IconSlash, IconWorld } from "@tabler/icons-react";

import { CodeChip } from '@/components/code-chip';
import { FunctionalGroup, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getHardinessZone, HardinessZone } from '@/types/hardiness-zone';
import { SizeChip } from '@/components/size-chip';
import { capitalizeFirstLetter, formatMonthChip, speciesFirstWord } from '@/lib/utils';
import { HardinessZoneInfo, PlantZoneInfo } from '@/components/hover-cards/hardiness-zone-info';
import { FunctionalGroupInfo } from '@/components/hover-cards/functional-group-info';
import { NativeInfo } from '@/components/hover-cards/native-info';
import { SunInfo } from '@/components/hover-cards/sun-info';
import { getSunConditionValue } from '@/types/sun-condition';
import { getSoilHumidityValue, getSoilRichnessValue, getSoilStructureValue } from '@/types/soil-condition';
import { VSeparator } from '@/components/vertical-separator';
import { HoverInfo } from '@/components/hover-cards/hover-info';
import { PlantName } from '@/components/plant-link';

const Capitalized = ({ children }: { children: React.ReactNode }) => {
    if (typeof children === "string") {
        return (
            <span>{capitalizeFirstLetter(children)}</span>
        );
    }
    return children;
};

const GeneralInfoRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <tr>
        <td className='p-1 pl-2 text-sm'>{label}</td>
        <td className='flex items-center'>
            <VSeparator />
            <Capitalized>
                {children}
            </Capitalized>
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
                {!loading && (
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
                                {!!plant && (
                                    <>
                                        <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="#"><i>{plant.species || plant.genus}</i></BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        {!plant && (
                            <span className='text-lg'>
                                Aucune plante ne correspond à ce code
                            </span>
                        )}
                        {!!plant && (
                            <Card className="shadow-none rounded-xs relative">
                                <CardHeader className="">
                                    <div className='flex justify-end'>
                                        {type && <h2 className='flex-grow text-lg text-muted-foreground'>{type.label}</h2>}
                                        {plant.isNative && (
                                            <HoverInfo
                                                trigger={<IconLeaf className='text-green-400' title='Indigène' />}
                                                content={<NativeInfo />} />
                                        )}
                                    </div>
                                    <div className='flex mt-2'>
                                        <CodeChip plant={plant} />
                                        <div className="grow ml-4">
                                            <CardTitle className="text-3xl">
                                                <PlantName plant={plant} />
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
                                                <HoverInfo
                                                    trigger={<div className="font-light text-xs">Zone de rusticité</div>}
                                                    content={<HardinessZoneInfo />}
                                                    className='w-180' />
                                                <HoverInfo
                                                    trigger={
                                                        <div className="flex items-center font-medium text-lg">
                                                            <Separator
                                                                orientation="vertical"
                                                                className='mr-2 data-[orientation=vertical]:h-4'
                                                                style={{
                                                                    backgroundColor: zone?.colorHex,
                                                                    width: '8px'
                                                                }}
                                                            />
                                                            {zone?.value || 'Inconnue'}
                                                        </div>}
                                                    content={zone && <PlantZoneInfo zone={zone} />} />
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
                                            Classification
                                        </div>
                                        <table className="table-auto w-full mt-4 text-ms">
                                            <tbody>
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
                                            Informations horticoles
                                        </div>
                                        <table className="table-auto w-full mt-4 text-ms">
                                            <tbody>
                                                {!!plant.sunTolerance?.length && (
                                                    <GeneralInfoRow label='Tolérance au soleil'>
                                                        <HoverInfo
                                                            trigger={
                                                                <Capitalized>
                                                                    {plant.sunTolerance.map(s => getSunConditionValue(s)).join(', ')}
                                                                </Capitalized>
                                                            }
                                                            content={<SunInfo />} />
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.soilHumidity?.length && (
                                                    <GeneralInfoRow label='Humidité du sol'>
                                                        {plant.soilHumidity.map(s => getSoilHumidityValue(s)).join(', ')}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.soilRichness?.length && (
                                                    <GeneralInfoRow label='Matière du sol'>
                                                        {plant.soilRichness.map(s => getSoilRichnessValue(s)).join(', ')}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.soilStructure?.length && (
                                                    <GeneralInfoRow label='Structure du sol'>
                                                        {plant.soilStructure.map(s => getSoilStructureValue(s)).join(', ')}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.groundSaltTolerance && (
                                                    <GeneralInfoRow label='Tolérance aux sels de déglaçage'>
                                                        {plant.groundSaltTolerance}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.airSaltTolerance && (
                                                    <GeneralInfoRow label='Tolérance aux embruns salins'>
                                                        {plant.airSaltTolerance}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.soilAcidity && (
                                                    <GeneralInfoRow label='Acidité du sol'>
                                                        {plant.soilAcidity}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.bloom?.length && (
                                                    <GeneralInfoRow label='Floraison'>
                                                        {plant.bloom.map(b => formatMonthChip(b)).join(', ')}
                                                    </GeneralInfoRow>
                                                )}
                                                {!!plant.plantationDistance && (
                                                    <GeneralInfoRow label='Distance de plantation HQ'>
                                                        <SizeChip size={plant.plantationDistance} />
                                                    </GeneralInfoRow>
                                                )}
                                                {!!functionalGroup && (
                                                    <GeneralInfoRow label='Groupe fonctionnel'>
                                                        <HoverInfo
                                                            trigger={<span className='cursor-help'>{functionalGroup.value} - {functionalGroup.label}</span>}
                                                            content={<FunctionalGroupInfo group={functionalGroup} />}
                                                            className={`border-${functionalGroup.color}`} />
                                                    </GeneralInfoRow>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {plant.remarks && (
                                        <>
                                            <Separator className='mt-8' />
                                            <div className='flex-col mt-8'>
                                                <div className='text-xl font-semibold'>
                                                    Remarques
                                                </div>
                                                <div className='mt-4'>
                                                    {plant.remarks}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Separator className='mt-8' />
                                    <div className='flex-col mt-8'>
                                        <div className='text-xl font-semibold'>
                                            Plus d'informations
                                        </div>
                                        <div className='mt-4'>
                                            {plant.hydroID &&
                                                <div className='pt-1'>
                                                    <Link className='flex items-center text-blue-600 dark:text-blue-500 hover:underline' href={`https://arbres.hydroquebec.com/fiche-arbre-arbuste/${plant.hydroID}`} target='_blank'>
                                                        <IconExternalLink className="opacity-60 mr-2" size={16} />
                                                        Hydro-Québec - Le bon arbre au bon endroit
                                                    </Link>
                                                </div>
                                            }
                                            {plant.referenceUrl &&
                                                <div className='pt-1'>
                                                    <Link className='flex items-center text-blue-600 dark:text-blue-500 hover:underline' href={plant.referenceUrl} target='_blank'>
                                                        <IconExternalLink className="opacity-60 mr-2" size={16} />
                                                        Jardin Deux-Montagnes
                                                    </Link>
                                                </div>
                                            }
                                            {plant.vascanID &&
                                                <div className='pt-1'>
                                                    <Link className='flex items-center text-blue-600 dark:text-blue-500 hover:underline' href={`https://data.canadensys.net/vascan/taxon/${plant.vascanID}`} target='_blank'>
                                                        <IconExternalLink className="opacity-60 mr-2" size={16} />
                                                        Base de données des plantes vasculaires du Canada (VASCAN)
                                                    </Link>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <Separator className='mt-8' />
                                    <div className='flex-col mt-8'>
                                        <div className='text-xl font-semibold'>
                                            Images
                                        </div>

                                        <div className='mt-4'>
                                            <iframe id='images' width='100%' height='600' src={`https://www.bing.com/images/search?q=${plant.species || plant.genus} ${plant.cultivar}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
