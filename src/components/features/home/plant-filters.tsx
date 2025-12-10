import React, { useEffect, useState } from "react";
import { IconArrowsHorizontal, IconArrowsVertical, IconCar, IconCategory, IconDroplet, IconDropletFilled, IconFeather, IconFlower, IconPlant, IconSalt, IconSearch, IconSun, IconTrees, IconWorld, IconX } from "@tabler/icons-react";

import { SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
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

export function PlantFilters(props:
    {
        filters: Filters,
        onChangeFilters: (filters: Filters) => void,
        onApplyFilters: (filters: Filters) => void,
        onResetFilters: () => void
    }) {
    const [searchDisabled, setSearchDisabled] = useState(false);

    useEffect(() => {
        const isDefaultFilters = JSON.stringify(props.filters) === JSON.stringify(DEFAULT_FILTERS);
        setSearchDisabled(isDefaultFilters);
    }, [props.filters]);

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        props.onApplyFilters(props.filters);
    };

    return (
        <SidebarGroup className='px-0'>
            <form onSubmit={handleSearch}>
                <SidebarGroupContent className="flex flex-col">
                    <SidebarMenu>
                        <SidebarMenuItem className='px-2'>
                            <IconSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
                            <Input name='q' className="pl-8" placeholder="nom commun, latin..." value={props.filters.q || ""} onChange={(e) => props.onChangeFilters({ ...props.filters, q: e.target.value })} />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>

                <SidebarGroupContent className='grid grid-cols-2 gap-6 mt-4'>
                    <SidebarMenu className='pr-2'>
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
                            value={props.filters.zone}
                            labelFormatter={(t: HardinessZone) => `${t.value} (${t.label})`}
                            setValue={v => props.onChangeFilters({ ...props.filters, zone: v || undefined })} />

                        <FilterItemMultiSelect
                            title={() =>
                                <SunInfo>
                                    <div className='cursor-help'>Ensoleillement</div>
                                </SunInfo>
                            }
                            icon={IconSun}
                            placeholder="Tous"
                            options={SUNCONDITIONS}
                            selectedValues={props.filters.sunConditions}
                            setSelectedValues={v => props.onChangeFilters({ ...props.filters, sunConditions: v || undefined })} />

                        <FilterItemCheckbox
                            title='Présence de sels de déglaçage'
                            id='groundSalt'
                            icon={IconSalt}
                            value={props.filters.groundSalt}
                            setValue={v => props.onChangeFilters({ ...props.filters, groundSalt: v || undefined })} />

                        <FilterItemCheckbox
                            title="Présence d'embruns salins"
                            id='airSalt'
                            icon={IconCar}
                            value={props.filters.airSalt}
                            setValue={v => props.onChangeFilters({ ...props.filters, airSalt: v || undefined })} />

                        <FilterItemCheckbox
                            title='Sujet à la sécheresse'
                            id='drought'
                            icon={IconDroplet}
                            value={props.filters.drought}
                            setValue={v => props.onChangeFilters({ ...props.filters, drought: v || undefined })} />

                        <FilterItemCheckbox
                            title="Sujet à l'inondation"
                            id='flood'
                            icon={IconDropletFilled}
                            value={props.filters.flood}
                            setValue={v => props.onChangeFilters({ ...props.filters, flood: v || undefined })} />
                    </SidebarMenu>

                    <SidebarMenu className='pl-2 mr-16'>
                        <SidebarGroupLabel>Critères de la plante</SidebarGroupLabel>
                        <FilterItemSelect
                            name='type'
                            title='Type'
                            placeholder='Tous'
                            icon={IconPlant}
                            options={PLANTTYPES}
                            value={props.filters.type}
                            sorter={(a, b) => a['label'].localeCompare(b['label'])}
                            setValue={v => props.onChangeFilters({ ...props.filters, type: v || undefined })} />

                        <FilterItemSelect
                            name='group'
                            title='Groupe fonct.'
                            placeholder='Tous'
                            icon={IconTrees}
                            options={FUNCTIONALGROUPS}
                            value={props.filters.functionalGroup}
                            labelFormatter={(t: FunctionalGroup) => `${t.value} - ${t.label}`}
                            disabled={!['.', '1 AR', '1b ARB', '2 CON', '3 ARBU'].includes(props.filters.type ?? '')}
                            setValue={v => props.onChangeFilters({ ...props.filters, functionalGroup: v || undefined })} />

                        <FilterItemSelect
                            name='grouping'
                            title='Caractéristique'
                            placeholder='Tous'
                            icon={IconCategory}
                            options={GROUPINGS}
                            value={props.filters.grouping}
                            setValue={v => props.onChangeFilters({ ...props.filters, grouping: v || undefined })} />

                        <FilterItemSelect
                            name='bloom'
                            title='Floraison'
                            placeholder="Toute l'année"
                            icon={IconFlower}
                            options={MONTHS}
                            sorter={a => Number(a)}
                            value={props.filters.bloom}
                            setValue={v => props.onChangeFilters({ ...props.filters, bloom: v || undefined })} />

                        <FilterItemSlider
                            name='height'
                            title='Hauteur'
                            min={0}
                            max={3000}
                            steps={10}
                            icon={IconArrowsVertical}
                            value={props.filters.height}
                            labelFormatter={formatSizeChip}
                            setValue={v => props.onChangeFilters({ ...props.filters, height: Array.isArray(v) && v.length === 2 ? [v[0], v[1]] as [number, number] : props.filters.height })} />

                        <FilterItemSlider
                            name='spread'
                            title='Largeur'
                            min={0}
                            max={3000}
                            steps={10}
                            icon={IconArrowsHorizontal}
                            value={props.filters.spread}
                            labelFormatter={formatSizeChip}
                            setValue={v => props.onChangeFilters({ ...props.filters, spread: Array.isArray(v) && v.length === 2 ? [v[0], v[1]] as [number, number] : props.filters.spread })} />

                        <FilterItemCheckbox
                            title='Espèce indigène'
                            id='native'
                            icon={IconFeather}
                            value={props.filters.native}
                            setValue={v => props.onChangeFilters({ ...props.filters, native: v || undefined })} />
                    </SidebarMenu>
                </SidebarGroupContent>

                <SidebarFooter className="grid grid-cols-2 gap-6 mt-4">
                    <Button type='button' variant="outline" onClick={props.onResetFilters}>
                        <IconX style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                    <Button type="submit" disabled={searchDisabled}>
                        <IconSearch style={{ display: 'initial' }} className="w-4 h-4 mr-1" />
                        Rechercher
                    </Button>
                </SidebarFooter>
            </form>
        </SidebarGroup >
    );
}
