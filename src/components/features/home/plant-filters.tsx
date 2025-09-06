import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { IconArrowsHorizontal, IconArrowsVertical, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPalette, IconPlant, IconSalt, IconSandbox, IconSearch, IconSun, IconTrees, IconWorld, IconX } from "@tabler/icons-react";

import { SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOOMS, COLORS, DEFAULT_FILTERS, Filters, SALTS, SOILS, SUNS, ZONES } from "@/types/filters";
import { PLANTTYPES } from "@/types/plantType";
import { FUNCTIONALGROUPS } from "@/types/functional-groups";
import { FilterItemSelect } from "@/components/filter-item-select";
import { FilterItemCheckbox } from "@/components/filter-item-checkbox";
import { FilterItemSlider } from "@/components/filter-item-slider";

export function PlantFilters(props:
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
            <SidebarGroupContent className="flex flex-col p-2 pt-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent className='grid grid-cols-2 gap-6 mt-4'>
                <SidebarMenu>
                    <SidebarGroupLabel>Conditions du site</SidebarGroupLabel>
                    <FilterItemSelect
                        title='Zone'
                        placeholder='Toutes'
                        icon={IconWorld}
                        options={ZONES}
                        value={filters.zone}
                        setValue={v => setFilters(f => ({ ...f, zone: v || undefined }))} />

                    <FilterItemSelect
                        title='Sol'
                        placeholder='Tous'
                        icon={IconSandbox}
                        options={SOILS}
                        value={filters.soil}
                        setValue={v => setFilters(f => ({ ...f, soil: v || undefined }))} />

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

                <SidebarMenu>
                    <SidebarGroupLabel>Conditions de la plante</SidebarGroupLabel>
                    <FilterItemSelect
                        title='Type'
                        placeholder='Tous'
                        icon={IconPlant}
                        options={PLANTTYPES}
                        value={filters.type}
                        setValue={v => setFilters(f => ({ ...f, type: v || undefined }))} />

                    <FilterItemSelect
                        title='Couleur'
                        placeholder='Toutes'
                        icon={IconPalette}
                        options={COLORS}
                        value={filters.color}
                        setValue={v => setFilters(f => ({ ...f, color: v || undefined }))} />

                    <FilterItemSelect
                        title='Floraison'
                        placeholder='Toutes'
                        icon={IconFlower}
                        options={BLOOMS}
                        value={filters.bloom}
                        setValue={v => setFilters(f => ({ ...f, bloom: v || undefined }))} />

                    <FilterItemSelect
                        title='Groupe fonct.'
                        placeholder='Tous'
                        icon={IconTrees}
                        options={FUNCTIONALGROUPS}
                        value={filters.functionalGroup}
                        setValue={v => setFilters(f => ({ ...f, functionalGroup: v || undefined }))} />

                    <FilterItemSlider
                        title='Hauteur'
                        min={0}
                        max={3000}
                        icon={IconArrowsVertical}
                        value={filters.height}
                        setValue={v => setFilters(f => ({ ...f, height: v }))} />

                    <FilterItemSlider
                        title='Largeur'
                        min={0}
                        max={3000}
                        icon={IconArrowsHorizontal}
                        value={filters.spread}
                        setValue={v => setFilters(f => ({ ...f, spread: v }))} />

                    <FilterItemCheckbox
                        title='Espèce indigène'
                        id='native'
                        icon={IconFeather}
                        value={filters.native}
                        setValue={v => setFilters(f => ({ ...f, native: v || undefined }))} />
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarFooter className="grid grid-cols-2 gap-6 mt-4">
                <Button variant="outline" onClick={props.onResetFilters}>
                    <IconX style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Reset
                </Button>
                <Button type="submit" onClick={() => props.onApplyFilters(filters)} disabled={searchDisabled}>
                    <IconSearch style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                    Rechercher
                </Button>
            </SidebarFooter>
        </SidebarGroup >
    );
}
