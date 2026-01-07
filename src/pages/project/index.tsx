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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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

const monthLookup = (month: number) => ({
    1: 'j',
    2: 'f',
    3: 'm',
    4: 'a',
    5: 'm',
    6: 'j',
    7: 'j',
    8: 'a',
    9: 's',
    10: 'o',
    11: 'n',
    12: 'd'
}[month]);

export default function ProjectPage() {
    const { projectPlants, clearCart } = useProject();

    const [plantList, setPlantList] = useState<ProjectPlant[]>([]);
    const [groupedPlants, setGroupedPlants] = useState<Partial<Record<PlantTypeValue, ProjectPlant[]>>>({});
    const [plantCount, setPlantCount] = useState<number>(0);
    const [typeChartData, setTypeChartData] = useState<TypeChartData[]>();
    const [nativeData, setNativeData] = useState({
        native: 0,
        other: 0,
    });
    const [genusChartData, setGenusChartData] = useState<GenusChartData[]>();
    const [groupChartData, setGroupChartData] = useState<GroupChartData[]>();

    useEffect(() => {
        if (plantList.length) {
            const groupedTypes = Object.groupBy(plantList, plant => plant.type);
            setGroupedPlants(groupedTypes);

            setTypeChartData(Object.entries(groupedTypes).map(([key, values]) => ({
                type: key, count: (values ?? []).reduce((a, b) => a + 1, 0), fill: getPlantType(key as PlantTypeValue).color
            })));

            const nativeCounts = {
                native: 0,
                other: 0,
            };
            var total = 0;
            plantList.forEach(p => {
                if (p.isNative) {
                    nativeCounts.native++;
                    total++;
                } else {
                    nativeCounts.other++;
                    total++;
                }
            });
            const nativeData = {
                native: ~~((nativeCounts.native / total) * 100),
                other: ~~((nativeCounts.other / total) * 100),
            };
            setPlantCount(total);
            setNativeData(nativeData);

            const groupedGenus = Object.groupBy(plantList, plant => plant.genus);
            setGenusChartData(Object.entries(groupedGenus).map(([key, values]) => ({
                genus: key, count: (values ?? []).reduce((a, b) => a + 1, 0), fill: getRandomColor()
            })));

            const groupedGroups = Object.groupBy(plantList, plant => plant.functionalGroup ?? 'unknown');
            const data = [] as GroupChartData[];
            FUNCTIONALGROUPS.forEach(g => {
                var count = 0;
                if (groupedGroups[g.value]) {
                    for (const entry of groupedGroups[g.value] ?? []) {
                        count++;
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
                <div className='flex-col'>
                    <h1 className="text-3xl">
                        <div className='flex items-center'>
                            <div className='grow'>
                                Sommaire du projet
                            </div>
                            {Object.values(groupedPlants).length > 0 &&
                                <Button className="ml-2" onClick={clearCart}>Vider</Button>
                            }
                        </div>
                    </h1>
                    {Object.values(groupedPlants).length > 0 &&
                        <div className="text-sm text-muted-foreground">
                            {plantCount} plantes
                        </div>
                    }
                    <div className="grid">
                        <div className='grid grid-cols-2 mt-2 ml-2'>
                            <div className='flex-col'>
                                {!Object.values(groupedPlants).length
                                    ? (
                                        <span className='text-lg'>
                                            Le projet ne contient aucune plante
                                        </span>
                                    )
                                    : Object.entries(groupedPlants || {})
                                        .sort((a, b) => a[0].localeCompare(b[0]))
                                        .map(([key, values], i) => (
                                            <div key={key} className='mt-8'>
                                                <h2 className='text-xl font-semibold flex items-center gap-2'>
                                                    {React.createElement(getPlantType(key as PlantTypeValue).icon)}
                                                    {getPlantType(key as PlantTypeValue).label}
                                                    <span className='text-muted font-light text-sm'>({values?.length})</span>
                                                </h2>
                                                {values?.map((plant, j) => (
                                                    <div key={j} className='mt-2'>
                                                        <ShortPlantCard plant={plant} />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                            </div>
                            {Object.values(groupedPlants).length > 0 &&
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
                                                    {nativeData && <Badge variant='outline' className="text-green-400">{nativeData.native}% d'espèces indigènes</Badge>}
                                                </div>
                                                <div>
                                                    {nativeData && <Badge variant='outline'>{nativeData.other}% d'espèces autres</Badge>}
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
                                                className="aspect-square"
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

                                    <Separator className='mt-8' />
                                    <div className='flex-col mt-8'>
                                        <div className='text-xl font-semibold'>
                                            Calendrier des floraisons
                                        </div>
                                        <div className='mt-4'>
                                            <table>
                                                <thead className='table-auto'>
                                                    <tr>
                                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, i) => (
                                                            <td key={`header-${month}`} className='px-1'>
                                                                {month === 0
                                                                    ? (<div>&nbsp;</div>)
                                                                    : (<div>{monthLookup(month)}</div>)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className='table-auto'>
                                                    {plantList.map((plant, j) => (
                                                        <tr key={j}>
                                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, i) => (
                                                                <td className='px-1'>
                                                                    {month === 0
                                                                        ? <div className='text-xs'>{plant.code}</div>
                                                                        : <div className='flex justify-center items-center'>
                                                                            {plant.bloom?.includes(month) ? 'X' : '-'}
                                                                        </div>
                                                                    }
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
