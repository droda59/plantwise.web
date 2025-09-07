import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarMenuFilterItem } from "./filter-item";

export function FilterItemSelect(props: {
    title: string,
    placeholder: string,
    icon: Icon,
    options: any[],
    value?: string,
    getLabel?: (t: any) => string,
    disabled?: boolean,
    setValue: (value: React.SetStateAction<any>) => void
}) {
    const createSelectItem = (t: any, i: number) => {
        if (props.getLabel) {
            return <SelectItem key={i} value={t.value}>{props.getLabel(t)}</SelectItem>;
        }
        else if (typeof t === 'string') {
            return <SelectItem key={i} value={t}>{t}</SelectItem>;
        } else if (typeof t === 'object') {
            return <SelectItem key={i} value={t.value}>{t.label}</SelectItem>;
        }

        return null;
    }

    return (
        <SidebarMenuFilterItem icon={props.icon} title={props.title}>
            <Select value={props.value || ""} onValueChange={props.setValue} disabled={props.disabled}>
                <SelectTrigger className="grow"><SelectValue placeholder={props.placeholder} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value=".">Tous</SelectItem>
                    {props.options.sort((a, b) => {
                        if (props.getLabel) {
                            return props.getLabel(a).localeCompare(props.getLabel(b));
                        }
                        else if (typeof a === 'string') {
                            return a.localeCompare(b);
                        } else if (typeof a === 'object') {
                            return a['label'].localeCompare(b['label']);
                        }
                    }).map(createSelectItem)}
                </SelectContent>
            </Select>
        </SidebarMenuFilterItem>
    );
}
