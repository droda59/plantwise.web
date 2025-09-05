import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarMenuFilterItem } from "./filter-item";

const createSelectItem = (t: any, i: number) => {
    if (typeof t === 'string') {
        return <SelectItem key={i} value={t}>{t}</SelectItem>;
    } else if (typeof t === 'object') {
        return <SelectItem key={i} value={t.value}>{t.label}</SelectItem>;
    }

    return null;
}

export function FilterItemSelect(props: {
    title: string,
    placeholder: string,
    icon: Icon,
    options: any[],
    value?: string,
    setValue: (value: React.SetStateAction<any>) => void
}) {
    return (
        <SidebarMenuFilterItem icon={props.icon} title={props.title}>
            <Select value={props.value || ""} onValueChange={props.setValue}>
                <SelectTrigger className="grow"><SelectValue placeholder={props.placeholder} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value=".">Tous</SelectItem>
                    {props.options.map(createSelectItem)}
                </SelectContent>
            </Select>
        </SidebarMenuFilterItem>
    );
}
