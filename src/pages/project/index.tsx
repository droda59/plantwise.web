'use client';

import React, { useEffect, useState } from 'react';

import { ShortPlantCard } from '@/components/features/project/short-plant-card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, RadialBar, RadialBarChart, XAxis } from 'recharts';

import { getPlantType, PLANTTYPES, PlantTypeValue } from '@/types/plantType';
import { FUNCTIONALGROUPS, getFunctionalGroup } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { ProjectPlant, useProject } from '@/components/project-context';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ProjectLayout from './project-layout';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { FilterSidebar } from '@/components/features/search/filter-sidebar';
import { DEFAULT_FILTERS, Filters } from '@/types/filters';
import { SectionTitle } from '@/components/section-title';
import { IconFilter, IconLeaf, IconSearch, IconTrees, IconTrendingUp } from '@tabler/icons-react';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChartData {
    count: number,
    fill: string,
};

interface NativeChartData extends ChartData {
    native: string
};

interface TypeChartData extends ChartData {
    type: string
};

const typeChartConfig: Record<string, typeof PLANTTYPES[number]> = {};
PLANTTYPES.forEach(p => typeChartConfig[p.value] = p);

const nativeChartConfig = {
    title: {
        label: 'Indigènes vs Exotiques',
    },
    native: {
        label: 'Indigène',
        color: 'var(--color-green-400)'
    },
    other: {
        label: 'Exotique',
        /* color: '#f8cb35' */
        color: 'var(--color-text-muted)',
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
    title: {
        label: 'Groupes fonctionnels',
    },
    ...FUNCTIONALGROUPS.map(g => ({
        [g.value]: {
            label: g.value,
            color: `var(--color-${g.color || 'text-muted'}`,
        }
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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

function ProjectPage() {
    const { projectPlants, clearCart } = useProject();

    const [plantList, setPlantList] = useState<ProjectPlant[]>([]);
    const [groupedPlants, setGroupedPlants] = useState<Partial<Record<PlantTypeValue, ProjectPlant[]>>>({});
    // const [typeChartData, setTypeChartData] = useState<TypeChartData[]>();
    const [nativeChartData, setNativeChartData] = useState<NativeChartData[]>();
    const [nativeData, setNativeData] = useState({
        native: 0,
        other: 0,
    });
    const [groupChartData, setGroupChartData] = useState<GroupChartData[]>();
    const [genusChartData, setGenusChartData] = useState<GenusChartData[]>();

    useEffect(() => {
        if (plantList.length) {
            const groupedTypes = Object.groupBy(plantList, plant => plant.type);
            setGroupedPlants(groupedTypes);

            /*
            setTypeChartData(Object.entries(groupedTypes).map(([key, values]) => ({
                type: key, count: (values ?? []).reduce((a, b) => a + 1, 0), fill: getPlantType(key as PlantTypeValue).color
            })));
            */

            const nativeData = {
                native: ~~((plantList.filter(p => p.isNative).length / plantList.length) * 100),
                other: 0,
            };
            nativeData.other = 100 - nativeData.native;
            setNativeData(nativeData);
            setNativeChartData(Object.entries(nativeData).map(([key, count]) => ({
                native: key,
                count,
                fill: nativeChartConfig[key as keyof typeof nativeChartConfig].color
            })));

            const groupedGroups = Object.groupBy(plantList, plant => plant.functionalGroup ?? 'unknown');
            const data = FUNCTIONALGROUPS.map(g => ({
                group: g.value,
                count: groupedGroups[g.value]?.length ?? 0,
                fill: groupChartConfig[g.value as keyof typeof groupChartConfig].color
            }));
            setGroupChartData(data);

            const groupedGenus = Object.groupBy(plantList, plant => plant.genus);
            setGenusChartData(Object.entries(groupedGenus).map(([key, values]) => ({
                genus: key, count: (values ?? []).reduce((a, b) => a + 1, 0), fill: getRandomColor()
            })));
        }
    }, [plantList]);

    useEffect(() => {
        setPlantList(projectPlants);
    }, [projectPlants]);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 100)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <Sidebar collapsible="offcanvas" variant="inset" >
                <SidebarContent>
                    {Object.entries(groupedPlants || {})
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([key, values], i) => (
                            <SidebarGroup key={key}>
                                <SidebarGroupContent className="flex flex-col gap-2 p-2">
                                    <SidebarMenu>
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
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                </SidebarContent>
            </Sidebar >
            <SidebarInset>
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                            {/*
                            <Card className="@container/card">
                                <CardHeader>
                                    <CardDescription>Ratio de types</CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        $1,250.00
                                    </CardTitle>
                                    <CardAction>
                                        <Badge variant="outline">
                                            <IconTrendingUp />
                                            +12.5%
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={typeChartConfig}>
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent hideLabel />
                                                }
                                            />
                                            <Pie data={typeChartData} dataKey="count" nameKey="type" />
                                            <ChartLegend content={<ChartLegendContent />} />
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Trending up this month <IconTrendingUp className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground">
                                        Visitors for the last 6 months
                                    </div>
                                </CardFooter>
                            </Card>
                            */}

                            <Card className="@container/card">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold tabular-nums">
                                        Ratio d'indigènes
                                    </CardTitle>
                                    <CardAction>
                                        <IconLeaf className='text-green-400' />
                                    </CardAction>
                                </CardHeader>
                                <CardContent className='grow'>
                                    <ChartContainer config={nativeChartConfig}
                                        className="aspect-square">
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent indicator='line' labelKey='title' />
                                                }
                                            />
                                            <Pie data={nativeChartData} dataKey="count" nameKey="native" />
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium text-green-400">
                                        {nativeData.native}% d'espèces indigènes
                                    </div>
                                    <div className="text-muted-foreground">
                                        {nativeData.other}% d'espèces exotiques ou naturalisées
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold tabular-nums">
                                        Groupes fonctionnels
                                    </CardTitle>
                                    <CardAction>
                                        <IconTrees />
                                    </CardAction>
                                </CardHeader>
                                <CardContent className='grow'>
                                    <ChartContainer config={groupChartConfig} className='aspect-square'>
                                        <BarChart data={groupChartData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="group"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent indicator='line' labelKey='title' nameKey='group' />
                                                }
                                                wrapperClassName='rounded-sm border border-border shadow-md'
                                            />
                                            <Bar dataKey="count" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Groupes fonctionnels non couverts : {(groupChartData || []).filter((value) => value.count === 0).map(value => value.group).join(', ')}
                                    </div>
                                    <div className="text-muted-foreground">
                                        <Link className='flex items-center text-blue-600 dark:text-blue-500 hover:underline' href='/functional-groups'>
                                            Plus d'informations
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>

                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

{ /*
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
                            {projectPlants.length} plantes
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
*/}

ProjectPage.getLayout = (page: any) => {
    return <ProjectLayout>{page}</ProjectLayout>
};

export default ProjectPage;