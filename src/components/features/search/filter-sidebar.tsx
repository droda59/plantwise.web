"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconFilter } from "@tabler/icons-react"
import { Filters } from "@/types/filters"
import { NavPlantFilters } from "./nav-plant-filters"
import { SectionTitle } from "@/components/section-title"

export function FilterSidebar({
    filters,
    onApplyFilters,
    onResetFilters,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    filters: Filters,
    onApplyFilters: (filters: Filters) => void,
    onResetFilters: () => void
}) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <SectionTitle icon={IconFilter} title="Filtres" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavPlantFilters filters={filters} onApplyFilters={onApplyFilters} onResetFilters={onResetFilters} />
            </SidebarContent>
        </Sidebar >
    )
}
