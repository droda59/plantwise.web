'use client';

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';

import { getPlantType, PLANTTYPES, PlantTypeValue } from '@/types/plant-type';
import { FUNCTIONALGROUPS } from '@/types/functional-groups';
import { ProjectPlant, useProject } from '@/components/project-context';
import { Button } from '@/components/ui/button';
import ProjectLayout from './project-layout';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { IconClipboardList, IconLeaf, IconMinus, IconTrees, IconX } from '@tabler/icons-react';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFullPlantName } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/section-title';
import { Switch } from '@/components/ui/switch';
import { PlantLink } from '@/components/plant-link';

interface ChartData {
    count: number,
    fill: string,
};

interface NativeChartData extends ChartData {
    native: string
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
    const { projectPlants, clearCart, removeFromProject } = useProject();

    const [plantList, setPlantList] = useState<ProjectPlant[]>([]);
    const [groupedPlants, setGroupedPlants] = useState<Partial<Record<PlantTypeValue, ProjectPlant[]>>>({});
    const [nativeChartData, setNativeChartData] = useState<NativeChartData[]>();
    const [nativeData, setNativeData] = useState({
        native: 0,
        other: 0,
    });
    const [groupChartData, setGroupChartData] = useState<GroupChartData[]>();
    const [groupedGenus, setGroupedGenus] = useState<Partial<Record<string, ProjectPlant[]>>>({});
    const [shownTypes, setShownTypes] = useState<string[]>([]);

    const setupNativeData = (plants: ProjectPlant[]) => {
        const nativeData = {
            native: ~~((plants.filter(p => p.isNative).length / plantList.length) * 100),
            other: 0,
        };
        nativeData.other = 100 - nativeData.native;
        setNativeData(nativeData);
        setNativeChartData(Object.entries(nativeData).map(([key, count]) => ({
            native: key,
            count,
            fill: nativeChartConfig[key as keyof typeof nativeChartConfig].color
        })));
    };

    const setupFunctionalGroupData = (plants: ProjectPlant[]) => {
        const groupedGroups = Object.groupBy(plants, plant => plant.functionalGroup ?? 'unknown');
        const data = FUNCTIONALGROUPS.map(g => ({
            group: g.value,
            count: groupedGroups[g.value]?.length ?? 0,
            fill: groupChartConfig[g.value as keyof typeof groupChartConfig].color
        }));
        setGroupChartData(data);
    };

    const setupGenusData = (plants: ProjectPlant[]) => {
        const groupedGenus = Object.groupBy(plants, plant => plant.genus);
        setGroupedGenus(groupedGenus);
    };

    useEffect(() => {
        if (plantList.length) {
            const groupedTypes = Object.groupBy(plantList, plant => plant.type);
            setGroupedPlants(groupedTypes);
            setShownTypes(Object.keys(groupedTypes));
        } else {
            setGroupedPlants({});
            setShownTypes([]);
        }
    }, [plantList]);

    useEffect(() => {
        const shownPlants = plantList.filter(plant => shownTypes.includes(plant.type));

        setupNativeData(shownPlants);
        setupFunctionalGroupData(shownPlants);
        setupGenusData(shownPlants);
    }, [shownTypes]);

    useEffect(() => {
        setPlantList(projectPlants);
    }, [projectPlants]);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 80)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <Sidebar collapsible="offcanvas" variant="inset" >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SectionTitle icon={IconClipboardList} title="Projet" />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-2 p-2">
                            <SidebarMenu>
                                {PLANTTYPES
                                    .sort((a, b) => a.value.localeCompare(b.value))
                                    .map((type) => (
                                        <SidebarMenuItem key={`sidebar-type-${type.value}`}>
                                            <div className='flex items-center px-2 py-1'>
                                                <div className={`flex items-center gap-2 my-1 grow ${groupedPlants[type.value]?.length ? '' : 'text-muted'}`}>
                                                    {React.createElement(type.icon)}
                                                    {type.label}
                                                    {groupedPlants[type.value]?.length && <span className='text-muted font-light text-sm'>({groupedPlants[type.value]?.length})</span>}
                                                </div>
                                                <Switch checked={shownTypes.includes(type.value)} id={type.value} disabled={!groupedPlants[type.value]?.length} onCheckedChange={checked => checked ? setShownTypes([...shownTypes, type.value]) : setShownTypes(shownTypes.filter(t => t !== type.value))} />
                                            </div>
                                        </SidebarMenuItem>
                                    ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className='cursor-pointer text-destructive hover:text-destructive/50' onClick={() => clearCart()} disabled={projectPlants.length === 0}>
                                        <IconX />
                                        <span>Vider le projet</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar >
            <SidebarInset>
                <div className="@container/main gap-2 items-center px-6 overflow-auto block">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-4 @5xl/main:grid-cols-4">
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
                                                {months.map(month => (
                                                    <th key={`header-${month}`} className='px-1 text-foreground font-medium border-x-1'>
                                                        {monthLookup(month)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        {shownTypes
                                            .sort((a, b) => a.localeCompare(b))
                                            .map(type => (
                                                <tbody key={`bloom-type-${type}`}>
                                                    <tr>
                                                        <th className='text-md font-medium py-1 pl-2 bg-muted/10 border-y-1' colSpan={13}>
                                                            <div className='flex items-center gap-2'>
                                                                {React.createElement(getPlantType(type as PlantTypeValue).icon)}
                                                                {getPlantType(type as PlantTypeValue).label}
                                                            </div>
                                                        </th>
                                                    </tr>

                                                    {groupedPlants[type as PlantTypeValue]
                                                        ?.sort((a, b) => getFullPlantName(a).localeCompare(getFullPlantName(b)))
                                                        .map(plant => (
                                                            <tr key={`bloom-${plant.code}`} className='hover:bg-muted/20 transition-colors'>
                                                                <th className='w-1/4 text-right pr-2 pt-2 border-y-1'>
                                                                    <div className='flex-col'>
                                                                        <PlantLink plant={plant} className='hover:underline text-right text-sm/2 block' />
                                                                        <span className='text-muted-foreground text-xs/2 font-medium'>{plant.commonName}</span>
                                                                    </div>
                                                                </th>
                                                                {plant.bloom?.length === 0 ? (
                                                                    months.map(month => (
                                                                        <td key={`bloom-plant-${plant.code}-${month}`} className='w-[6.25%] py-1 border-1'>&nbsp;</td>
                                                                    ))
                                                                )
                                                                    : (
                                                                        <>
                                                                            {plant.bloom && plant.bloom.length !== 0 &&
                                                                                months.slice(0, plant.bloom[0] - 1).map(month => (
                                                                                    <td key={`bloom-plant-${plant.code}-${month}`} className='w-[6.25%] py-2 border-1' />
                                                                                ))}
                                                                            {plant.bloom && plant.bloom.map(month => (
                                                                                <td key={`bloom-plant-${plant.code}-${month}`} className={`w-[6.25%] py-2 bloom-month ${plant.bloom?.length === 1 && 'solo'} border-1`}><div className='h-4 bg-accent-foreground'>&nbsp;</div></td>
                                                                            ))}
                                                                            {plant.bloom && plant.bloom.length !== 0 &&
                                                                                months.slice(plant.bloom[plant.bloom.length - 1]).map(month => (
                                                                                    <td key={`bloom-plant-${plant.code}-${month}`} className='w-[6.25%] py-2 border-1' />
                                                                                ))}
                                                                        </>
                                                                    )}
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            ))}
                                    </table >
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-4 @4xl/page:grid-cols-[2fr_1fr] px-4">
                            <Card className="flex w-full flex-col gap-4">
                                <CardHeader className="flex flex-row items-center justify-between">
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="all">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="view-selector" className="sr-only">
                                                Vue
                                            </Label>
                                            <Select defaultValue="all">
                                                <SelectTrigger
                                                    className="flex w-fit @4xl/main:hidden"
                                                    size="sm"
                                                    id="view-selector"
                                                >
                                                    <SelectValue placeholder="Sélectionner une vue" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Végétaux</SelectItem>
                                                    <SelectItem value="genus">Genres</SelectItem>
                                                    <SelectItem value="families">Familles</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <TabsList className="**:data-[slot=tabs-trigger]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=tabs-trigger]:rounded-xs flex">
                                                <TabsTrigger value="all">Végétaux</TabsTrigger>
                                                <TabsTrigger value="genus">Genres</TabsTrigger>
                                                <TabsTrigger value="families">Familles</TabsTrigger>
                                            </TabsList>

                                            <Button variant="destructive" size="sm" className='cursor-pointer' onClick={() => clearCart()} disabled={projectPlants.length === 0}>
                                                Supprimer tout
                                            </Button>
                                        </div>
                                        <TabsContent value="all" className="relative flex flex-col overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableHeaderRow>
                                                        <TableHead>Nom</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Genre</TableHead>
                                                        <TableHead>Famille</TableHead>
                                                        <TableHead>Gr. fonctionnel</TableHead>
                                                        <TableHead>Statut</TableHead>
                                                    </TableHeaderRow>
                                                </TableHeader>
                                                <TableBody className="**:data-[slot=table-cell]:py-2.5">
                                                    {shownTypes
                                                        .sort((a, b) => a.localeCompare(b))
                                                        .map((type, i) =>
                                                            groupedPlants[type as PlantTypeValue]?.sort((a, b) => getFullPlantName(a).localeCompare(getFullPlantName(b))).map((plant, j) => (
                                                                <TableRow key={plant.code}>
                                                                    <TableCell className='font-medium'>
                                                                        <div className='flex-col'>
                                                                            <PlantLink plant={plant} className='hover:underline block' />
                                                                            <span className='text-muted-foreground text-sm font-light'>{plant.commonName}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className='flex items-center gap-2'>
                                                                            {React.createElement(getPlantType(plant.type).icon, { height: 16 })}
                                                                            {getPlantType(plant.type).label}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className='italic'>
                                                                        <Link className='hover:underline' href={`/genus/${plant.genus}`}>{plant.genus}</Link>
                                                                    </TableCell>
                                                                    <TableCell className='italic'>{plant.family}</TableCell>
                                                                    <TableCell>{plant.functionalGroup}</TableCell>
                                                                    <TableCell>
                                                                        <div className={`flex items-center gap-2 ${plant.isNative && 'text-green-400'}`}>
                                                                            {plant.isNative ? <IconLeaf className='text-green-400' height={16} /> : null}
                                                                            {plant.isNative ? "Indigène" : "Exotique"}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className='text-right'>
                                                                        <Button variant='destructive' className='px-1 py-1 cursor-pointer' onClick={() => removeFromProject(plant)}>
                                                                            <IconMinus />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )))}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>

                                        <TabsContent value="genus" className="relative flex flex-col overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Genre</TableHead>
                                                        <TableHead>Famille</TableHead>
                                                        <TableHead>Nombre</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="**:data-[slot=table-cell]:py-2.5">
                                                    {Object.entries(groupedGenus)
                                                        .sort((a, b) => a[0].localeCompare(b[0]))
                                                        .map(([key, values], i) =>
                                                            <TableRow key={key}>
                                                                <TableCell className='italic'>
                                                                    <Link className='hover:underline' href={`/genus/${key}`}>{key}</Link>
                                                                </TableCell>
                                                                <TableCell className='italic'>{values && values[0].family}</TableCell>
                                                                <TableCell>{values?.length}</TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>

                                        <TabsContent value="family" className="relative flex flex-col overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Famille</TableHead>
                                                        <TableHead>Nombre</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="**:data-[slot=table-cell]:py-2.5">
                                                    {Object.entries(groupedGenus)
                                                        .sort((a, b) => a[0].localeCompare(b[0]))
                                                        .map(([key, values], i) =>
                                                            values?.sort((a, b) => getFullPlantName(a).localeCompare(getFullPlantName(b))).map((plant, j) => (
                                                                <TableRow key={key}>
                                                                    <TableCell className='italic'>{plant.family}</TableCell>
                                                                    <TableCell>{plant.functionalGroup}</TableCell>
                                                                </TableRow>
                                                            )
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
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