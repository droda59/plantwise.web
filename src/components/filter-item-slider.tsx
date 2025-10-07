import React from "react";

import { SidebarMenuItem } from "./ui/sidebar";
import { Slider } from "./ui/slider";
import { Icon, IconProps } from "@tabler/icons-react";

export function FilterItemSlider(props: {
    title: string,
    min: number,
    max: number,
    steps?: number,
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>,
    value?: number[],
    disabled?: boolean,
    labelFormatter: (value: number) => string,
    setValue: (value: number[]) => void
}) {
    return (
        <SidebarMenuItem>
            {/* Ajouter text fields pour la recherche */}
            <div className={`flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 ${props.disabled && 'text-muted'}`}>
                <props.icon />
                <span className='flex w-full'>
                    <label className="grow text-sm font-medium">{props.title}</label>
                    {props.value && props.value.length && (
                        <span>
                            {props.labelFormatter(props.value[0])} - {props.labelFormatter(props.value[1])}
                        </span>
                    )}
                </span>
            </div>
            <div className='flex items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0'>
                <Slider
                    disabled={props.disabled}
                    min={props.min}
                    max={props.max}
                    step={props.steps || 1}
                    defaultValue={[props.value && props.value[0] || props.min, props.value && props.value[1] || props.max]}
                    onValueChange={props.setValue}
                />
            </div>
        </SidebarMenuItem>
    );
}
