'use client';

import React, { useEffect, useState } from 'react';

import { Plant } from '@/types/plant';
import { plantApiInstance } from '@/api/plant-api';
import { ShortPlantCard } from '@/components/features/project/short-plant-card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { LabelList, Pie, PieChart, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { getPlantType, PLANTTYPES } from '@/types/plantType';
import { FUNCTIONALGROUPS, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';

interface ChartData {
    count: number,
    fill: string,
};

interface TypeChartData extends ChartData {
    type: string
};

const typeChartConfig: Record<string, typeof PLANTTYPES[number]> = {};
PLANTTYPES.forEach(p => typeChartConfig[p.value] = p);

interface NativeChartData extends ChartData {
    type: string,
};

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

/*
const groupChartConfig = {
} satisfies ChartConfig;
FUNCTIONALGROUPS.forEach(g => groupChartConfig[g.value] = g);
*/


type ProjectPlantEntry = {
    plant: Plant,
    count: number
};

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export default function ProjectPage() {
    const [plantList, setPlantList] = useState<ProjectPlantEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [typeChartData, setTypeChartData] = useState<TypeChartData[]>();
    const [nativeData, setNativeData] = useState({
        native: 0,
        naturalized: 0,
        other: 0,
    });
    const [genusChartData, setGenusChartData] = useState<GenusChartData[]>();
    const [groupChartData, setGroupChartData] = useState<GroupChartData[]>();

    const fetchList = async () => {
        setLoading(true);

        // TODO Prendre les plantes dans le browser or something
        const plant1 = await plantApiInstance.getPlant('ACN');
        const plant2 = await plantApiInstance.getPlant('OVI');
        const plant3 = await plantApiInstance.getPlant('ULB');
        const plant4 = await plantApiInstance.getPlant('PDM');
        const plant5 = await plantApiInstance.getPlant('PUR');
        setPlantList([
            ...(plant1 ? [{ plant: plant1, count: 3 }] : []),
            ...(plant2 ? [{ plant: plant2, count: 7 }] : []),
            ...(plant3 ? [{ plant: plant3, count: 2 }] : []),
            ...(plant4 ? [{ plant: plant4, count: 5 }] : []),
            ...(plant5 ? [{ plant: plant5, count: 6 }] : []),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        if (plantList.length) {
            const groupedTypes = Object.groupBy(plantList, ({ plant }) => plant.type);
            const typeData = [] as TypeChartData[];
            PLANTTYPES.forEach(t => {
                var count = 0;
                if (groupedTypes[t.value]) {
                    for (const entry of groupedTypes[t.value] ?? []) {
                        count += entry.count;
                    }
                }
                typeData.push({ type: t.value, count, fill: getPlantType(t.value)?.color });
            });
            setTypeChartData(typeData);

            const nativeCounts = {
                native: 0,
                naturalized: 0,
                other: 0,
            };
            var total = 0;
            plantList.forEach(p => {
                if (p.plant.isNative) {
                    nativeCounts.native += p.count;
                    total += p.count;
                } else if (p.plant.isNaturalized) {
                    nativeCounts.naturalized += p.count;
                    total += p.count;
                } else {
                    nativeCounts.other += p.count;
                    total += p.count;
                }
            });
            const nativeData = {
                native: ~~((nativeCounts.native / total) * 100),
                naturalized: ~~((nativeCounts.naturalized / total) * 100),
                other: ~~((nativeCounts.other / total) * 100),
            };
            setNativeData(nativeData);
            console.log('nativeData', nativeData);

            setGenusChartData(plantList.map(p => {
                return {
                    genus: p.plant.genus ?? '', count: p.count, fill: getRandomColor()
                };
            }));

            const groupedGroups = Object.groupBy(plantList, ({ plant }) => plant.functionalGroup ?? 'unknown');
            const data = [] as GroupChartData[];
            FUNCTIONALGROUPS.forEach(g => {
                var count = 0;
                if (groupedGroups[g.value]) {
                    for (const entry of groupedGroups[g.value] ?? []) {
                        count += entry.count;
                    }
                }
                data.push({ group: g.value, count, fill: getFunctionalGroup(g.value)?.colorHex ?? "#cccccc" });
            });

            setGroupChartData(data);
        }
    }, [plantList]);

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                {!loading && (
                    <>
                        <div className='flex-col'>
                            <h1 className='text-3xl font-semibold'>Sommaire du projet</h1>
                            <div className='grid grid-cols-2 mt-8'>
                                <div className='flex-col'>
                                    {plantList?.map((plant, index) => (
                                        <div key={index} className='mt-2'>
                                            <ShortPlantCard plant={plant.plant} count={plant.count} />
                                        </div>
                                    ))}
                                </div>
                                <div className='flex-col'>
                                    <div>
                                        <h2>Graph de type</h2>
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
                                    <div>
                                        <h2>Stats de indigènes</h2>
                                        <div className='flex'>
                                            <div>
                                                {nativeData && nativeData.native && <Badge variant='outline' className="text-emerald-700 rounded-xs">{nativeData.native}% d'espèces indigènes</Badge>}
                                            </div>
                                            <div>
                                                {nativeData && nativeData.naturalized && <Badge variant='outline' className="ml-1 text-amber-700 rounded-xs">{nativeData.naturalized} % d'espèces naturalisées</Badge>}
                                            </div>
                                            <div>
                                                {nativeData && nativeData.other && <Badge variant='outline' className="ml-1 rounded-xs">{nativeData.other}% d'espèces autres</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2>Graph de genre</h2>
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
                                    <div>
                                        <h2>Graph de groupe fonctionnel</h2>
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
                    </>
                )}
            </main>
        </div>
    );
}
