import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { IconArrowsHorizontal, IconArrowsVertical, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPalette, IconPlant, IconSalt, IconSandbox, IconSearch, IconSun, IconWorld, IconX } from "@tabler/icons-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Filters } from "@/types/filters";
import { PLANTTYPES } from "@/types/plantType";
import { FUNCTIONALGROUPS } from "@/types/functional-groups";

const ZONES = ['0a', '0b', '1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'];
const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
const SALTS = ["haute", "moyenne", "faible"];
const BLOOMS = ["printemps", "été", "automne"];
const prettySun = s => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

const SidebarMenuFilterItem = ({
    icon: Icon,
    title = '',
    label = '',
    target = '',
    ...props
}) => (
    <SidebarMenuItem>
        <div className='flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'>
            <Icon />
            {title && <span>{title}</span>}
            {label && <label className='grow' htmlFor={target}>{label}</label>}
            {props.children}
        </div>
    </SidebarMenuItem>
);

const SizeLabel = ({ size }: { size: number }) => {
    if (size > 100) return <span>{size / 100} m</span>;
    return <span>{size} cm</span>;
}

const SizeChip = (
    {
        size,
        ...props
    }: React.ComponentProps<'span'> & {
        size: number[]
    }
) => {
    if (!size || !size.length) return false;
    return (
        <span {...props}>
            <SizeLabel size={size[0]} /> - <SizeLabel size={size[1]} />
        </span>
    );
}

export function NavPlantFilters({ filters: DEFAULT_FILTERS, onApplyFilters }:
    {
        filters?: Filters,
        onApplyFilters: (filters: Filters) => void,
    }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [searchDisabled, setSearchDisabled] = useState(false);

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    useEffect(() => {
        const isDefaultFilters = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
        setSearchDisabled(isDefaultFilters);
    }, [filters]);

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarGroupLabel>Conditions du site</SidebarGroupLabel>
                    <SidebarMenuFilterItem icon={IconWorld} title='Zone'>
                        <Select value={filters.zone ?? ""} onValueChange={v => setFilters(f => ({ ...f, zone: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {ZONES.map(z => (<SelectItem key={z} value={z}>{z}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconSandbox} title='Sol'>
                        <Select value={filters.soil || ""} onValueChange={v => setFilters(f => ({ ...f, soil: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {SOILS.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconSun} title='Ensoleillement'>
                        <Select value={filters.sun || ""} onValueChange={v => setFilters(f => ({ ...f, sun: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {SUNS.map(s => (<SelectItem key={s} value={s}>{prettySun(s)}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconSalt} title='Présence de sels'>
                        <Select value={filters.saltConditions || ""} onValueChange={v => setFilters(f => ({ ...f, saltConditions: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {SALTS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconDroplet} label='Sujet à la sécheresse' target='droughtTolerant'>
                        <Switch checked={!!filters.droughtTolerant} onCheckedChange={v => setFilters(f => ({ ...f, droughtTolerant: v || undefined }))} id="droughtTolerant" />
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconDropletFilled} label="Sujet à l'excès d'eau" target='floodTolerant'>
                        <Switch checked={!!filters.floodTolerant} onCheckedChange={v => setFilters(f => ({ ...f, floodTolerant: v || undefined }))} id="floodTolerant" />
                    </SidebarMenuFilterItem>
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarGroupLabel>Conditions de la plante</SidebarGroupLabel>
                    <SidebarMenuFilterItem icon={IconPlant} title='Type'>
                        <Select value={filters.type || ""} onValueChange={v => setFilters(f => ({ ...f, type: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {PLANTTYPES.map((t, i) => (<SelectItem key={i} value={t.value}>{t.label}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconPalette} title='Couleur'>
                        <Select value={filters.color || ""} onValueChange={v => setFilters(f => ({ ...f, color: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {COLORS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconFlower} title='Floraison'>
                        <Select value={filters.bloom || ""} onValueChange={v => setFilters(f => ({ ...f, bloom: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {BLOOMS.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    <SidebarMenuFilterItem icon={IconFlower} title='Groupe fonct.'>
                        <Select value={filters.functionalGroup || ""} onValueChange={v => setFilters(f => ({ ...f, functionalGroup: v || undefined }))}>
                            <SelectTrigger className="grow"><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {FUNCTIONALGROUPS.map(b => (<SelectItem key={b.value} value={b.value}>{`${b.value} - ${b.label}`}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </SidebarMenuFilterItem>

                    {/* Ajouter text fields pour la recherche */}
                    <SidebarMenuItem>
                        <div className='flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'>
                            <IconArrowsVertical />
                            <span className='flex w-full'>
                                <label className="grow text-sm font-medium">Hauteur</label>
                                <SizeChip size={filters.height} />
                            </span>
                        </div>
                        <div className='flex items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0'>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={v => setFilters(f => ({ ...f, height: v || undefined }))}
                            />
                        </div>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <div className='flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'>
                            <IconArrowsHorizontal />
                            <span className='flex w-full'>
                                <label className="grow text-sm font-medium">Largeur</label>
                                <SizeChip size={filters.spread} />
                            </span>
                        </div>
                        <div className='flex items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0'>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={v => setFilters(f => ({ ...f, spread: v || undefined }))}
                            />
                        </div>
                    </SidebarMenuItem>

                    <SidebarMenuFilterItem icon={IconFeather} label='Espèce indigène' target='native'>
                        <Switch checked={!!filters.native} onCheckedChange={v => setFilters(f => ({ ...f, native: v || undefined }))} id="native" />
                    </SidebarMenuFilterItem>
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent className="flex gap-2 p-2">
                <Button style={{ display: 'initial' }} className="flex-col grow" variant="outline" onClick={resetFilters}>
                    <IconX style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Reset
                </Button>
                <Button style={{ display: 'initial' }} className="flex-col grow" type="submit" onClick={() => onApplyFilters(filters)} disabled={searchDisabled}>
                    <IconSearch style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Rechercher
                </Button>
            </SidebarGroupContent>
        </SidebarGroup >
    );
}
