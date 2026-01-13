'use client';

import React, { useEffect, useState } from 'react';

import { ShortPlantCard } from '@/components/features/project/short-plant-card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';

import { getPlantType, PLANTTYPES, PlantTypeValue } from '@/types/plantType';
import { FUNCTIONALGROUPS } from '@/types/functional-groups';
import { Badge } from '@/components/ui/badge';
import { ProjectPlant, useProject } from '@/components/project-context';
import { Button } from '@/components/ui/button';
import ProjectLayout from './project-layout';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarInset, SidebarMenu, SidebarProvider } from '@/components/ui/sidebar';
import { IconLeaf, IconTrees } from '@tabler/icons-react';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import { cn, getFullPlantName } from '@/lib/utils';

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
            color: g.colorHex,
        }
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
} satisfies ChartConfig;
console.log(groupChartConfig);

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const monthLookup = (month: number) => ({
    1: 'jan',
    2: 'fév',
    3: 'mar',
    4: 'avr',
    5: 'mai',
    6: 'jun',
    7: 'jui',
    8: 'aou',
    9: 'sep',
    10: 'oct',
    11: 'nov',
    12: 'déc'
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

                                        {values?.sort((a, b) => getFullPlantName(a).localeCompare(getFullPlantName(b))).map((plant, j) => (
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
                <div className="@container/main gap-2 items-center px-6 overflow-auto block">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
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
                                    <ChartContainer config={nativeChartConfig} className="">
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
                                    <ChartContainer config={groupChartConfig} className=''>
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

                            {/*
                            <Card className="@container/card">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold tabular-nums">
                                        Genres utilisés
                                    </CardTitle>
                                    <CardAction>
                                        <IconTrees />
                                    </CardAction>
                                </CardHeader>
                                <CardContent className='grow'>
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
                            */}
                        </div>

                        <div className="grid grid-cols-1 gap-4 @4xl/page:grid-cols-[2fr_1fr] px-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold tracking-tight">
                                        Calendrier des floraisons
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <table className='w-full bloom-calendar'>
                                        <thead className='table-auto'>
                                            <tr>
                                                <th>&nbsp;</th>
                                                {months.map((month, i) => (
                                                    <th key={`header-${month}`} className='px-1'>
                                                        {monthLookup(month)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        {Object.entries(groupedPlants || {})
                                            .sort((a, b) => a[0].localeCompare(b[0]))
                                            .map(([key, values], i) => (
                                                <>
                                                    <tbody className='table-auto'>
                                                        <tr>
                                                            <th className='text-md font-medium py-1 pl-2 bg-muted/10' colSpan={13}>
                                                                <div className='flex items-center gap-2'>
                                                                    {React.createElement(getPlantType(key as PlantTypeValue).icon)}
                                                                    {getPlantType(key as PlantTypeValue).label}
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </tbody>

                                                    {values?.sort((a, b) => getFullPlantName(a).localeCompare(getFullPlantName(b))).map((plant, j) => (
                                                        <tbody className='table-auto'>
                                                            <tr key={j}>
                                                                <th className='w-1/4 text-right pr-2 pt-2'>
                                                                    <div className='flex-col'>
                                                                        <Link href={`/plant/${plant.code}`} className='hover:underline text-right text-sm/2 block'>
                                                                            <span className='italic'>{plant.species || plant.genus}</span>
                                                                            {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
                                                                            {plant.note && <span>&nbsp;({plant.note})</span>}
                                                                        </Link>
                                                                        <span className='text-muted-foreground text-xs/2 font-medium'>{plant.commonName}</span>
                                                                    </div>
                                                                </th>
                                                                {plant.bloom?.length === 0 ? (
                                                                    months.map((month, i) => (
                                                                        <td className='w-[6.25%] py-1'>&nbsp;</td>
                                                                    ))
                                                                )
                                                                    : (
                                                                        <>
                                                                            {plant.bloom && plant.bloom.length !== 0 &&
                                                                                months.slice(0, plant.bloom[0] - 1).map(() => (
                                                                                    <td className='w-[6.25%] py-2' />
                                                                                ))}
                                                                            {plant.bloom && plant.bloom.map(month => (
                                                                                <td className={`w-[6.25%] py-2 bloom-month ${plant.bloom?.length === 1 && 'solo'}`}><div className='h-4 bg-accent-foreground'>&nbsp;</div></td>
                                                                            ))}
                                                                            {plant.bloom && plant.bloom.length !== 0 &&
                                                                                months.slice(plant.bloom[plant.bloom.length - 1]).map(() => (
                                                                                    <td className='w-[6.25%] py-2' />
                                                                                ))}
                                                                        </>
                                                                    )}
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                </>
                                            ))}
                                    </table >
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-4 @4xl/page:grid-cols-[2fr_1fr] px-4">
                            <Card className="flex w-full flex-col gap-4">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <Tabs defaultValue="all">
                                        <TabsList className="w-full @3xl/page:w-fit">
                                            <TabsTrigger value="all">Familles</TabsTrigger>
                                            <TabsTrigger value="in-stock">Genres</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Stock</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date Added</TableHead>
                                                <TableHead />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="**:data-[slot=table-cell]:py-2.5">
                                            {plantList.map((plant) => (
                                                <TableRow key={plant.code}>
                                                    <TableCell className="font-medium">
                                                        <span className='italic'>{plant.species || plant.genus}</span>
                                                        {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
                                                        {plant.note && <span>&nbsp;({plant.note})</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ${plant.family}
                                                    </TableCell>
                                                    <TableCell className="text-right">{plant.genus}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className={
                                                                plant.isNative
                                                                    ? "text-green-400"
                                                                    : "text-muted-foreground"
                                                            }
                                                        >
                                                            {plant.isNative ? "Indigène" : "Exotique"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-6">
                                                                    <EllipsisVerticalIcon />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem variant="destructive">
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className="flex flex-col items-center justify-between border-t pt-6 @3xl/page:flex-row">
                                    <div className="text-muted-foreground hidden text-sm @3xl/page:block">
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    );
}

ProjectPage.getLayout = (page: any) => {
    return <ProjectLayout>{page}</ProjectLayout>
};

export default ProjectPage;