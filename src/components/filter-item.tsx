import React from "react";

import { SidebarMenuItem } from "./ui/sidebar";
import { Icon, IconProps } from "@tabler/icons-react";

interface SidebarMenuFilterItemProps {
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    title?: any;
    label?: string;
    target?: string;
    children?: React.ReactNode;
    disabled?: boolean,
    [key: string]: any;
}

export const SidebarMenuFilterItem = ({
    icon: Icon,
    title: Title,
    label = '',
    target = '',
    ...props
}: SidebarMenuFilterItemProps) => (
    <SidebarMenuItem>
        <div className={`flex items-center gap-2 overflow-hidden rounded-md py-2 px-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] 
            ${props.disabled
                ? 'text-muted hover:text-muted data-[state=open]:hover:text-muted'
                : 'data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
            focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0`}>
            {Icon && <Icon />}
            {Title && ((typeof Title === 'string')
                ? <span>{Title}</span>
                : <Title />
            )}
            {label && <label className='grow' htmlFor={target}>{label}</label>}
            {props.children}
        </div>
    </SidebarMenuItem>
);
