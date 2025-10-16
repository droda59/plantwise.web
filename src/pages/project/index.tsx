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

import { getPlantType, PLANTTYPES } from '@/types/plantType';
import { FUNCTIONALGROUPS, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { ProjectPlant, useProject } from '@/components/project-context';

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

/*
const groupChartConfig = {
} satisfies ChartConfig;
FUNCTIONALGROUPS.forEach(g => groupChartConfig[g.value] = g);
*/

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export default function ProjectPage() {
    const { projectPlants } = useProject();

    const [plantList, setPlantList] = useState<ProjectPlant[]>([]);
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
            const groupedTypes = Object.groupBy(plantList, (plant) => plant.type);
            const typeData = [] as TypeChartData[];
            PLANTTYPES.forEach(t => {
                var count = 0;
                if (groupedTypes[t.value]) {
                    for (const entry of groupedTypes[t.value] ?? []) {
                        count += entry.quantity;
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
            setNativeData(nativeData);

            setGenusChartData(plantList.map(p => {
                return {
                    genus: p.genus ?? '', count: p.quantity, fill: getRandomColor()
                };
            }));

            const groupedGroups = Object.groupBy(plantList, (plant) => plant.functionalGroup ?? 'unknown');
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
                <div className='flex-col'>
                    <h1 className='text-3xl font-semibold'>Sommaire du projet</h1>
                    <div className='grid grid-cols-2 mt-8'>
                        <div className='flex-col'>
                            {plantList?.map((plant, index) => (
                                <div key={index} className='mt-2'>
                                    <ShortPlantCard plant={plant} count={plant.quantity} />
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
            </main>
        </div>
    );
}
