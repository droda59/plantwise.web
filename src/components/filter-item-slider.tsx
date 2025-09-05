import React from "react";

import { SidebarMenuItem } from "./ui/sidebar";
import { Slider } from "./ui/slider";

const SizeLabel = ({ size }: { size: number }) => {
    if (size > 100) return <span>{size / 100} m</span>;
    return <span>{size} cm</span>;
}

const SizeChip = (
    {
        size,
        ...props
    }: React.ComponentProps<'span'> & {
        size?: number[]
    }
) => {
    if (!size || !size.length) return false;
    return (
        <span {...props}>
            <SizeLabel size={size[0]} /> - <SizeLabel size={size[1]} />
        </span>
    );
}

export function FilterItemSlider(props: {
    title: string,
    min: number,
    max: number,
    icon: Icon,
    value?: number[],
    setValue: (value: number[]) => void
}) {
    return (
        <SidebarMenuItem>
            {/* Ajouter text fields pour la recherche */}
            <div className='flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'>
                <props.icon />
                <span className='flex w-full'>
                    <label className="grow text-sm font-medium">{props.title}</label>
                    <SizeChip size={props.value} />
                </span>
            </div>
            <div className='flex items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>svg]:size-4 [&>svg]:shrink-0'>
                <Slider
                    min={0}
                    max={3000}
                    step={10}
                    defaultValue={[props.value && props.value[0] || 0, props.value && props.value[1] || 3000]}
                    onValueChange={props.setValue}
                />
            </div>
        </SidebarMenuItem>
    );
}
