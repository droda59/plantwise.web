import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { IconArrowsHorizontal, IconArrowsVertical, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPalette, IconPlant, IconSalt, IconSandbox, IconSearch, IconSun, IconTrees, IconWorld, IconX } from "@tabler/icons-react";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COLORS, DEFAULT_FILTERS, Filters, SALTS, SUNS } from "@/types/filters";
import { PLANTTYPES } from "@/types/plantType";
import { FunctionalGroup, FUNCTIONALGROUPS } from "@/types/functional-groups";
import { FilterItemSelect } from "@/components/filter-item-select";
import { FilterItemCheckbox } from "@/components/filter-item-checkbox";
import { FilterItemSlider } from "@/components/filter-item-slider";
import { HardinessZone, ZONES } from "@/types/hardiness-zone";

function formatSizeChip(size: number): string {
    if (size > 100) return `${size / 100} m`;
    return `${size} cm`;
}

function formatMonthChip(month: number): string {
    switch (month) {
        case 1: return 'Janvier';
        case 2: return 'Février';
        case 3: return 'Mars';
        case 4: return 'Avril';
        case 5: return 'Mai';
        case 6: return 'Juin';
        case 7: return 'Juillet';
        case 8: return 'Août';
        case 9: return 'Septembre';
        case 10: return 'Octobre';
        case 11: return 'Novembre';
        case 12: return 'Décembre';
        default: return '';
    }
}

export function NavPlantFilters(props:
    {
        filters: Filters,
        onApplyFilters: (filters: Filters) => void,
        onResetFilters: () => void
    }) {
    const [filters, setFilters] = useState(props.filters);
    const [searchDisabled, setSearchDisabled] = useState(false);

    useEffect(() => {
        setFilters(props.filters);
    }, [props]);

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
                    <SidebarGroupLabel>Critères du site</SidebarGroupLabel>
                    <FilterItemSelect
                        title='Zone'
                        placeholder='Toutes'
                        icon={IconWorld}
                        options={ZONES}
                        value={filters.zone}
                        labelFormatter={(t: HardinessZone) => `${t.value} (${t.city})`}
                        setValue={v => setFilters(f => ({ ...f, zone: v || undefined }))} />

                    <FilterItemSelect
                        title='Ensoleillement'
                        placeholder='Tous'
                        icon={IconSun}
                        options={SUNS}
                        value={filters.sun}
                        setValue={v => setFilters(f => ({ ...f, sun: v || undefined }))} />

                    <FilterItemSelect
                        title='Présence de sels'
                        placeholder='Tous'
                        icon={IconSalt}
                        options={SALTS}
                        value={filters.saltConditions}
                        setValue={v => setFilters(f => ({ ...f, saltConditions: v || undefined }))} />

                    <FilterItemCheckbox
                        title='Sujet à la sécheresse'
                        id='droughtTolerant'
                        icon={IconDroplet}
                        value={filters.droughtTolerant}
                        setValue={v => setFilters(f => ({ ...f, droughtTolerant: v || undefined }))} />

                    <FilterItemCheckbox
                        title="Sujet à l'excès d'eau"
                        id='floodTolerant'
                        icon={IconDropletFilled}
                        value={filters.floodTolerant}
                        setValue={v => setFilters(f => ({ ...f, floodTolerant: v || undefined }))} />
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarGroupLabel>Critères de la plante</SidebarGroupLabel>
                    <FilterItemSelect
                        title='Type'
                        placeholder='Tous'
                        icon={IconPlant}
                        options={PLANTTYPES}
                        value={filters.type}
                        setValue={v => setFilters(f => ({ ...f, type: v || undefined }))} />

                    <FilterItemSelect
                        title='Groupe fonct.'
                        placeholder='Tous'
                        icon={IconTrees}
                        options={FUNCTIONALGROUPS}
                        value={filters.functionalGroup}
                        labelFormatter={(t: FunctionalGroup) => `${t.value} - ${t.label}`}
                        disabled={!['.', '1 AR', '1b ARB', '2 CON', '3 ARBU'].includes(filters.type ?? '')}
                        setValue={v => setFilters(f => ({ ...f, functionalGroup: v || undefined }))} />

                    <FilterItemSelect
                        title='Couleur'
                        placeholder='Toutes'
                        icon={IconPalette}
                        options={COLORS}
                        value={filters.color}
                        setValue={v => setFilters(f => ({ ...f, color: v || undefined }))} />

                    <FilterItemSlider
                        title='Floraison'
                        min={1}
                        max={12}
                        icon={IconFlower}
                        value={filters.bloom}
                        labelFormatter={formatMonthChip}
                        setValue={v => setFilters(f => ({ ...f, bloom: v as [number, number] }))} />

                    <FilterItemSlider
                        title='Hauteur'
                        min={0}
                        max={3000}
                        steps={10}
                        icon={IconArrowsVertical}
                        value={filters.height}
                        labelFormatter={formatSizeChip}
                        setValue={v => setFilters(f => ({ ...f, height: v as [number, number] }))} />

                    <FilterItemSlider
                        title='Largeur'
                        min={0}
                        max={3000}
                        steps={10}
                        icon={IconArrowsHorizontal}
                        value={filters.spread}
                        labelFormatter={formatSizeChip}
                        setValue={v => setFilters(f => ({ ...f, spread: v as [number, number] }))} />

                    <FilterItemCheckbox
                        title='Espèce indigène'
                        id='native'
                        icon={IconFeather}
                        value={filters.native}
                        setValue={v => setFilters(f => ({ ...f, native: v || undefined }))} />
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent className="flex gap-2 p-2">
                <Button style={{ display: 'initial' }} className="flex-col grow" variant="outline" onClick={props.onResetFilters}>
                    <IconX style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Reset
                </Button>
                <Button style={{ display: 'initial' }} className="flex-col grow" type="submit" onClick={() => props.onApplyFilters(filters)} disabled={searchDisabled}>
                    <IconSearch style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Rechercher
                </Button>
            </SidebarGroupContent>
        </SidebarGroup >
    );
}
