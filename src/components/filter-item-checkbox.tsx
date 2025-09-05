import React, { useState } from "react";

import { Switch } from "./ui/switch";
import { SidebarMenuFilterItem } from "./filter-item";

export function FilterItemCheckbox(props: {
    title: string,
    id: string,
    icon: Icon,
    value?: boolean,
    setValue: (value: React.SetStateAction<any>) => void
}) {
    return (
        <SidebarMenuFilterItem icon={props.icon} label={props.title} target={props.id}>
            <Switch checked={!!props.value} onCheckedChange={props.setValue} id={props.id} />
        </SidebarMenuFilterItem>
    );
}
