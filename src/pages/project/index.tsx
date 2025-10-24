'use client';

import React, { useEffect, useState } from 'react';

import { ShortPlantCard } from '@/components/features/project/short-plant-card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { LabelList, Pie, PieChart, RadialBar, RadialBarChart } from 'recharts';

import { getPlantType, PLANTTYPES, PlantTypeValue } from '@/types/plantType';
import { FUNCTIONALGROUPS, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { ProjectPlant, useProject } from '@/components/project-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ChartData {
    count: number,
    fill: string,
};

interface TypeChartData extends ChartData {
    type: string
};

const typeChartConfig: Record<string, typeof PLANTTYPES[number]> = {};
PLANTTYPES.forEach(p => typeChartConfig[p.value] = p);

const nativeChartConfig = {
    native: {
        label: 'Indigène',
    },
    naturalized: {
        label: 'Naturalisé',
    },
    other: {
        label: 'Autre',
    }
} satisfies ChartConfig;

interface GenusChartData extends ChartData {
    genus: string,
};

const genusChartConfig = {
    genus: {
        label: 'Genre',
    },
} satisfies ChartConfig;

interface GroupChartData extends ChartData {
    group: string,
};

const groupChartConfig = {
    count: {
        label: "Nombre",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export default function ProjectPage() {
    const { projectPlants } = useProject();

    const [plantList, setPlantList] = useState<ProjectPlant[]>([]);
    const [groupedPlants, setGroupedPlants] = useState<Partial<Record<PlantTypeValue, ProjectPlant[]>>>({});
    const [plantCount, setPlantCount] = useState<number>(0);
    const [typeChartData, setTypeChartData] = useState<TypeChartData[]>();
    const [nativeData, setNativeData] = useState({
        native: 0,
        naturalized: 0,
        other: 0,
    });
    const [genusChartData, setGenusChartData] = useState<GenusChartData[]>();
    const [groupChartData, setGroupChartData] = useState<GroupChartData[]>();

    useEffect(() => {
        if (plantList.length) {
            const groupedTypes = Object.groupBy(plantList, plant => plant.type);
            setGroupedPlants(groupedTypes);

            setTypeChartData(Object.entries(groupedTypes).map(([key, values]) => ({
                type: key, count: (values ?? []).reduce((a, b) => a + b.quantity, 0), fill: getPlantType(key as PlantTypeValue).color
            })));

            const nativeCounts = {
                native: 0,
                naturalized: 0,
                other: 0,
            };
            var total = 0;
            plantList.forEach(p => {
                if (p.isNative) {
                    nativeCounts.native += p.quantity;
                    total += p.quantity;
                } else if (p.isNaturalized) {
                    nativeCounts.naturalized += p.quantity;
                    total += p.quantity;
                } else {
                    nativeCounts.other += p.quantity;
                    total += p.quantity;
                }
            });
            const nativeData = {
                native: ~~((nativeCounts.native / total) * 100),
                naturalized: ~~((nativeCounts.naturalized / total) * 100),
                other: ~~((nativeCounts.other / total) * 100),
            };
            setPlantCount(total);
            setNativeData(nativeData);

            const groupedGenus = Object.groupBy(plantList, plant => plant.genus);
            setGenusChartData(Object.entries(groupedGenus).map(([key, values]) => ({
                genus: key, count: (values ?? []).reduce((a, b) => a + b.quantity, 0), fill: getRandomColor()
            })));

            const groupedGroups = Object.groupBy(plantList, plant => plant.functionalGroup ?? 'unknown');
            const data = [] as GroupChartData[];
            FUNCTIONALGROUPS.forEach(g => {
                var count = 0;
                if (groupedGroups[g.value]) {
                    for (const entry of groupedGroups[g.value] ?? []) {
                        count += entry.quantity;
                    }
                }
                data.push({ group: g.value, count, fill: getFunctionalGroup(g.value)?.colorHex ?? "#cccccc" });
            });
            setGroupChartData(data);
        }
    }, [plantList]);

    useEffect(() => {
        setPlantList(projectPlants);
    }, [projectPlants]);

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                <Card className="shadow-none rounded-xs relative">
                    <CardHeader>
                        <div className='flex mt-2'>
                            <div className="grow">
                                <CardTitle className="text-3xl">
                                    <h1>
                                        Sommaire du projet
                                    </h1>
                                </CardTitle>
                                <CardDescription>
                                    <h3 className="text-sm text-muted-foreground">
                                        {plantCount} plantes
                                    </h3>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid">
                        <div className='grid grid-cols-2 mt-2 ml-2'>
                            <div className='flex-col'>
                                {!Object.values(groupedPlants).length
                                    ? (
                                        <span className='text-lg'>
                                            Le projet ne contient aucune plante
                                        </span>
                                    )
                                    : Object.entries(groupedPlants || {}).map(([key, values], i) => (
                                        <div key={key} className='mt-4'>
                                            <h1 className='text-lg font-semibold'>
                                                {getPlantType(key as PlantTypeValue).label}
                                            </h1>
                                            {values?.map((plant, j) => (
                                                <div key={j} className='mt-2'>
                                                    <ShortPlantCard plant={plant} count={plant.quantity} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                            <div className='flex-col ml-8'>
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Ratio de types
                                    </div>
                                    <div className='mt-4'>
                                        <ChartContainer config={typeChartConfig}>
                                            <PieChart>
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent hideLabel />
                                                    }
                                                />
                                                <Pie data={typeChartData} dataKey="count" nameKey="type" />
                                            </PieChart>
                                        </ChartContainer>
                                    </div>
                                </div>

                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Statistiques d'indigènes
                                    </div>
                                    <div className='mt-4'>
                                        <div className='flex flex-col'>
                                            <div>
                                                {nativeData && nativeData.native && <Badge variant='outline' className="text-emerald-700 rounded-xs">{nativeData.native}% d'espèces indigènes</Badge>}
                                            </div>
                                            <div>
                                                {nativeData && nativeData.naturalized && <Badge variant='outline' className="mt-1 text-amber-700 rounded-xs">{nativeData.naturalized} % d'espèces naturalisées</Badge>}
                                            </div>
                                            <div>
                                                {nativeData && nativeData.other && <Badge variant='outline' className="mt-1 rounded-xs">{nativeData.other}% d'espèces autres</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Ratio de genres
                                    </div>
                                    <div className='mt-4'>
                                        <ChartContainer config={genusChartConfig}>
                                            <PieChart>
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent />
                                                    }
                                                />
                                                <Pie data={genusChartData} dataKey="count" nameKey="genus" />
                                            </PieChart>
                                        </ChartContainer>
                                    </div>
                                </div>

                                <Separator className='mt-8' />
                                <div className='flex-col mt-8'>
                                    <div className='text-xl font-semibold'>
                                        Groupes fonctionnels
                                    </div>
                                    <div className='mt-4'>
                                        <ChartContainer
                                            config={groupChartConfig}
                                            className="mx-auto aspect-square max-h-[350px]"
                                        >
                                            <RadialBarChart
                                                data={groupChartData}
                                                startAngle={180}
                                                endAngle={0}
                                                innerRadius={20}
                                                outerRadius={160}
                                            >
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel nameKey="group" />}
                                                />
                                                <RadialBar dataKey="count" background>
                                                    <LabelList
                                                        position="middle"
                                                        dataKey="group"
                                                        className="fill-primary"
                                                        fontSize={10}
                                                    />
                                                </RadialBar>
                                            </RadialBarChart>
                                        </ChartContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
