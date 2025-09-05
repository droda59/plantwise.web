import React from "react";

import { SidebarMenuItem } from "./ui/sidebar";

export const SidebarMenuFilterItem = ({
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
