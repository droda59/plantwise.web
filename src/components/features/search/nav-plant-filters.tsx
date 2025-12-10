import React, { useEffect, useState } from "react";
import { IconArrowsHorizontal, IconArrowsVertical, IconCar, IconCategory, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPlant, IconSalt, IconSearch, IconSun, IconTrees, IconWorld, IconX } from "@tabler/icons-react";

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
import { SUNCONDITIONS } from "@/types/sun-condition";
import { SunInfo } from "@/components/hover-cards/sun-info";
import { HardinessZoneInfo } from "@/components/hover-cards/hardiness-zone-info";
import { FilterItemMultiSelect } from "@/components/filter-item-multi-select";
import { GROUPINGS } from "@/types/grouping";

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

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        props.onApplyFilters(filters);
    };

    return (
        <SidebarGroup>
            <form onSubmit={handleSearch}>
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
                            title={() =>
                                <HardinessZoneInfo>
                                    <div className='cursor-help'>Zone</div>
                                </HardinessZoneInfo>
                            }
                            placeholder='Toutes'
                            icon={IconWorld}
                            options={ZONES}
                            value={filters.zone}
                            labelFormatter={(t: HardinessZone) => `${t.value} (${t.label})`}
                            setValue={v => setFilters(f => ({ ...f, zone: v || undefined }))} />

                        <FilterItemMultiSelect
                            title={() =>
                                <SunInfo>
                                    <div className='cursor-help'>Ensoleillement</div>
                                </SunInfo>
                            }
                            icon={IconSun}
                            placeholder="Tous"
                            options={SUNCONDITIONS}
                            selectedValues={filters.sunConditions}
                            setSelectedValues={v => setFilters({ ...props.filters, sunConditions: v || undefined })} />

                        <FilterItemCheckbox
                            title='Présence de sels de déglaçage'
                            id='groundSalt'
                            icon={IconSalt}
                            value={filters.groundSalt}
                            setValue={v => setFilters(f => ({ ...f, groundSalt: v || undefined }))} />

                        <FilterItemCheckbox
                            title="Présence d'embruns salins"
                            id='airSalt'
                            icon={IconCar}
                            value={filters.airSalt}
                            setValue={v => setFilters(f => ({ ...f, airSalt: v || undefined }))} />

                        <FilterItemCheckbox
                            title='Sujet à la sécheresse'
                            id='drought'
                            icon={IconDroplet}
                            value={filters.drought}
                            setValue={v => setFilters(f => ({ ...f, drought: v || undefined }))} />

                        <FilterItemCheckbox
                            title="Sujet à l'inondation"
                            id='flood'
                            icon={IconDropletFilled}
                            value={filters.flood}
                            setValue={v => setFilters(f => ({ ...f, flood: v || undefined }))} />
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

                        <FilterItemSelect
                            name='grouping'
                            title='Caractéristique'
                            placeholder='Tous'
                            icon={IconCategory}
                            options={GROUPINGS}
                            value={props.filters.grouping}
                            setValue={v => setFilters({ ...props.filters, grouping: v || undefined })} />

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
                    <Button type="button" style={{ display: 'initial' }} className="flex-col grow" variant="outline" onClick={props.onResetFilters}>
                        <IconX style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                    <Button type="submit" style={{ display: 'initial' }} className="flex-col grow" disabled={searchDisabled}>
                        <IconSearch style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                        Rechercher
                    </Button>
                </SidebarGroupContent>
            </form>
        </SidebarGroup >
    );
}
