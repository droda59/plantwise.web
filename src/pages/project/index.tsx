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
import { Pie, PieChart } from 'recharts';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { getPlantType, PLANTTYPES } from '@/types/plantType';
import { FUNCTIONALGROUPS } from '@/types/functional-groups';

interface ChartData {
    count: number,
    fill: string,
};

interface TypeChartData extends ChartData {
    type: string
};

const typeChartConfig = {
} satisfies ChartConfig;
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


interface GroupChartData {
    group: string,
    count: number,
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





export default function ProjectPage() {
    const [plantList, setPlantList] = useState<{plant: Plant, count: number}[]>([]);
    const [loading, setLoading] = useState(false);
    const [typeChartData, setTypeChartData] = useState<TypeChartData[]>();
    const [nativeChartData, setNativeChartData] = useState<NativeChartData[]>();
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
            { plant: plant1, count: 27 }, 
            { plant: plant2, count: 7 }, 
            { plant: plant3, count: 45 }, 
            { plant: plant4, count: 110 }, 
            { plant: plant5, count: 60 }, 
        ]);

        setLoading(false);
    };

    useEffect(() => {
        if (plantList.length) {
            setTypeChartData(plantList.map(p => {
                return {
                    type: p.plant.type, count: p.count, fill: getPlantType(p.plant.type).color
                };
            }));
            setNativeChartData(plantList.map(p => {
                if (p.plant.isNative) {
                    return { type: 'native', count: p.count, fill: 'green' };
                } else if (p.plant.isNaturalized) {
                    return { type: 'naturalized', count: p.count, fill: 'orange' };
                } else {
                    return { type: 'other', count: p.count, fill: 'lightgrey' };
                }
            }));
            setGenusChartData(plantList.map(p => {
                return {
                    genus: p.plant.genus, count: p.count, fill: 'yellow'
                };
            }));

            const groupedGroups = Object.groupBy(plantList, ({ plant }) => plant.functionalGroup);
            console.log('groupedGroups', groupedGroups);

            const data = [];
            FUNCTIONALGROUPS.forEach(g => {
                if (groupedGroups[g.value]) {
                    var count = 0;
                    for (const entry of groupedGroups[g.value]) {
                        count += entry.count;
                    }
                    data.push({ group: g.value, count });
                } else {
                    data.push({ group: g.value, count: 0 });
                }
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
                                        <h2>Graph de indigènes</h2>
                                        <ChartContainer config={nativeChartConfig}>
                                            <PieChart>
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent />
                                                    }
                                                />
                                                    <Pie data={nativeChartData} dataKey="count" nameKey="type" />
                                            </PieChart>
                                        </ChartContainer>
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
                                            className="mx-auto aspect-square max-h-[250px]"
                                        >
                                            <RadarChart data={groupChartData}>
                                                <ChartTooltip cursor={false} content={
                                                    <ChartTooltipContent 
                                                          indicator={Object.keys(groupChartConfig).length > 0 ? "dot" : "line"} 
                                                          formatter={value => value === null || value === undefined ? "N/A" : value.toLocaleString()}
                                                    />} 
                                                />
                                                <PolarAngleAxis dataKey="group" />
                                                <PolarGrid />
                                                <Radar
                                                    dataKey="count"
                                                    fill="var(--color-desktop)"
                                                    fillOpacity={0.6}
                                                />
                                            </RadarChart>
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

/*
export const description = "A radar chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
*/
