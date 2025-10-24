import React, { useEffect, useState } from "react";
import { IconArrowsHorizontal, IconArrowsVertical, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPalette, IconPlant, IconSalt, IconSandbox, IconSearch, IconSun, IconTrees, IconWorld, IconX } from "@tabler/icons-react";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_FILTERS, Filters, MONTHS } from "@/types/filters";
import { PLANTTYPES } from "@/types/plantType";
import { FunctionalGroup, FUNCTIONALGROUPS } from "@/types/functional-groups";
import { FilterItemSelect } from "@/components/filter-item-select";
import { FilterItemCheckbox } from "@/components/filter-item-checkbox";
import { FilterItemSlider } from "@/components/filter-item-slider";
import { HardinessZone, ZONES } from "@/types/hardiness-zone";
import { formatSizeChip } from "@/lib/utils";
import { SUNCONDITIONS, SunConditionValue } from "@/types/sun-condition";

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
                        <IconSearch className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input name='q' className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarGroupLabel>Critères du site</SidebarGroupLabel>
                    <FilterItemSelect
                        name='zone'
                        title='Zone'
                        placeholder='Toutes'
                        icon={IconWorld}
                        options={ZONES}
                        value={filters.zone}
                        labelFormatter={(t: HardinessZone) => `${t.value} (${t.label})`}
                        setValue={v => setFilters(f => ({ ...f, zone: v || undefined }))} />

                    <FilterItemSelect
                        name='sun'
                        title='Ensoleillement'
                        placeholder='Tous'
                        icon={IconSun}
                        options={SUNCONDITIONS}
                        sorter={(a: { value: SunConditionValue }) => ({
                            'full': 1,
                            'partial': 2,
                            'shade': 3,
                        }[a.value])}
                        value={filters.sunConditions}
                        setValue={v => setFilters(f => ({ ...f, sunConditions: v || undefined }))} />
                    {/* 
                    <FilterItemSelect
                        title='Présence de sels'
                        disabled
                        placeholder='Tous'
                        icon={IconSalt}
                        options={SALTS}
                        setValue={v => setFilters(f => ({ ...f, saltConditions: v || undefined }))} />
 */}
                    {/* 
                    <FilterItemCheckbox
                        title='Sujet à la sécheresse'
                        disabled
                        id='droughtTolerant'
                        icon={IconDroplet}
                        setValue={v => setFilters(f => ({ ...f, droughtTolerant: v || undefined }))} />
 */}
                    {/* 
                    <FilterItemCheckbox
                        title="Sujet à l'excès d'eau"
                        disabled
                        id='floodTolerant'
                        icon={IconDropletFilled}
                        setValue={v => setFilters(f => ({ ...f, floodTolerant: v || undefined }))} />
                         */}
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarGroupLabel>Critères de la plante</SidebarGroupLabel>
                    <FilterItemSelect
                        name='type'
                        title='Type'
                        placeholder='Tous'
                        icon={IconPlant}
                        options={PLANTTYPES}
                        sorter={(a, b) => a['label'].localeCompare(b['label'])}
                        value={filters.type}
                        setValue={v => setFilters(f => ({ ...f, type: v || undefined }))} />

                    <FilterItemSelect
                        name='group'
                        title='Groupe fonct.'
                        placeholder='Tous'
                        icon={IconTrees}
                        options={FUNCTIONALGROUPS}
                        value={filters.functionalGroup}
                        labelFormatter={(t: FunctionalGroup) => `${t.value} - ${t.label}`}
                        disabled={!['.', '1 AR', '1b ARB', '2 CON', '3 ARBU'].includes(filters.type ?? '')}
                        setValue={v => setFilters(f => ({ ...f, functionalGroup: v || undefined }))} />
                    {/* 
                    <FilterItemSelect
                        title='Couleur'
                        disabled
                        placeholder='Toutes'
                        icon={IconPalette}
                        options={COLORS}
                        setValue={v => setFilters(f => ({ ...f, color: v || undefined }))} />
 */}
                    <FilterItemSelect
                        name='bloom'
                        title='Floraison'
                        placeholder="Toute l'année"
                        icon={IconFlower}
                        options={MONTHS}
                        sorter={a => Number(a)}
                        value={filters.bloom}
                        setValue={v => setFilters(f => ({ ...f, bloom: v || undefined }))} />

                    <FilterItemSlider
                        name='height'
                        title='Hauteur'
                        min={0}
                        max={3000}
                        steps={10}
                        icon={IconArrowsVertical}
                        value={filters.height}
                        labelFormatter={formatSizeChip}
                        setValue={v => setFilters(f => ({ ...f, height: v as [number, number] }))} />

                    <FilterItemSlider
                        name='spread'
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
