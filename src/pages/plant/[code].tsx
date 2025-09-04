'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { plantApiInstance } from '@/api/plant-api';
import { Filters } from '@/types/filters';
import { Plant } from '@/types/plant';
import { getPlantType, PlantType, PlantTypeValue } from "@/types/plantType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";

const TypeChip = ({ plant, chipType }: { plant: Plant, chipType: PlantTypeValue }) => {
    function getChipBackgroundColor() {
        const style = {
            backgroundColor: 'lightgrey',
            height: '4px',
        };

        if (chipType === '1 AR' && (plant.type === '1 AR' || plant.type === '1b ARB')) style.backgroundColor = 'lightgreen';
        else if (chipType === '2 CON' && plant.type === '2 CON') style.backgroundColor = 'darkgreen';
        else if (chipType === '3 ARBU' && plant.type === '3 ARBU') style.backgroundColor = 'green';
        else if (chipType === '4 VIV' && (plant.type === '4 VIV' || plant.type === '10 FH')) style.backgroundColor = 'red';
        else if (chipType === '5 GRAM' && plant.type === '5 GRAM') style.backgroundColor = 'wheat';
        else if (chipType === '6 GRMP' && plant.type === '6 GRMP' || plant.type === '7 FOU') style.backgroundColor = 'wheat';
        else if (chipType === '8 AQUA' && plant.type === '8 AQUA') style.backgroundColor = 'teal';

        return style;
    };

    return (
        <span className="flex grow" style={getChipBackgroundColor()} />
    );
};

const CodeChip = ({ plant }: { plant: Plant }) => (
    <div className='flex items-center relative'>
        <div className='h-10 bg-primary' style={{
            aspectRatio: '1 / cos(30deg)',
            '--b': '2px',
            clipPath: 'polygon(0 50%, 50% -50%, 100% 50%, 50% 150%, 0 50%, var(--b) 50%, calc(25% + var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(75% - var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(100% - var(--b)) 50%, calc(75% - var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), calc(25% + var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), var(--b) 50%)',
        }} />
        <span className='text-xs w-full absolute text-center'>
            {plant.code}
        </span>
    </div>
);

const SizeChip = ({ size }: { size?: number }) => {
    if (!size) return <span>Inconnue</span>;
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

export default function Page({ params }) {
    const router = useRouter();

    console.log(router);
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
        <div>
            {!loading && !!plant && (
                <Card className="shadow-sm hover:shadow-md transition rounded-xs" style={{ position: 'relative' }}>
                    <div className="flex w-full" style={{
                        position: 'absolute',
                        top: 0
                    }}>
                        <TypeChip plant={plant} chipType='1 AR' />
                        <TypeChip plant={plant} chipType='2 CON' />
                        <TypeChip plant={plant} chipType='3 ARBU' />
                        <TypeChip plant={plant} chipType='4 VIV' />
                        <TypeChip plant={plant} chipType='5 GRAM' />
                        <TypeChip plant={plant} chipType='6 GRMP' />
                        <TypeChip plant={plant} chipType='8 AQUA' />
                    </div>
                    <CardHeader className="pb-2">
                        <div className='flex'>
                            <div className="grow">
                                <CardTitle className="text-lg">
                                    <span className='italic'>{latin}</span>
                                    {cultivar && <span>&nbsp;'{cultivar}'</span>}
                                    {/*{comment && <span> ({comment})</span>}*/}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">{plant.name}</div>
                            </div>

                            <CodeChip plant={plant} />
                        </div>
                    </CardHeader>
                    <CardContent className="grid">
                        <div className="flex mb-2">
                            {type && <Badge variant="secondary" className='rounded-xs'>{type.label}</Badge>}
                            {!!plant.functionalGroup && (
                                <Badge variant="secondary" className="ml-1 rounded-xs">Groupe&nbsp;{plant.functionalGroup}</Badge>
                            )}
                            {plant.isNative && (
                                <Badge className="ml-1 bg-emerald-100 text-emerald-700 rounded-xs">Indigène</Badge>
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
        </div>
    );
}
