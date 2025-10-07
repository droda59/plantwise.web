import React from "react";

import { Switch } from "./ui/switch";
import { SidebarMenuFilterItem } from "./filter-item";
import { Icon, IconProps } from "@tabler/icons-react";

export function FilterItemCheckbox(props: {
    title: string,
    id: string,
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>,
    value?: boolean,
    disabled?: boolean,
    setValue: (value: React.SetStateAction<any>) => void
}) {
    return (
        <SidebarMenuFilterItem icon={props.icon} label={props.title} target={props.id}>
            <Switch checked={!!props.value} onCheckedChange={props.setValue} id={props.id} disabled={props.disabled} />
        </SidebarMenuFilterItem>
    );
}
