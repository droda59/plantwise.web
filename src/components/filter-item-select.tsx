import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarMenuFilterItem } from "./filter-item";
import { Icon, IconProps } from "@tabler/icons-react";

export function FilterItemSelect(props: {
    title: string,
    placeholder: string,
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>,
    options: any[],
    value?: string,
    sorter?: (a: any, b: any) => number,
    labelFormatter?: (t: any) => string,
    disabled?: boolean,
    setValue: (value: React.SetStateAction<any>) => void
}) {
    // TODO Voir pour que le sélectionné n'ait pas le long label
    const createSelectItem = (t: any, i: number) => {
        if (props.labelFormatter) {
            return <SelectItem key={i} value={t.value}>{props.labelFormatter(t)}</SelectItem>;
        }
        else if (typeof t === 'string') {
            return <SelectItem key={i} value={t}>{t}</SelectItem>;
        } else if (typeof t === 'object') {
            return <SelectItem key={i} value={t.value}>{t.label}</SelectItem>;
        }

        return null;
    }

    return (
        <SidebarMenuFilterItem icon={props.icon} title={props.title} disabled={props.disabled}>
            <Select value={props.value || ""} onValueChange={props.setValue} disabled={props.disabled}>
                <SelectTrigger className="grow"><SelectValue placeholder={props.placeholder} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value=".">Tous</SelectItem>
                    {props.options.sort((a, b) => {
                        if (props.sorter) {
                            return props.sorter(a, b);
                        } else if (typeof a === 'string') {
                            return a.localeCompare(b);
                        } else if (typeof a === 'object') {
                            return a['value'].localeCompare(b['value']);
                        }
                    }).map(createSelectItem)}
                </SelectContent>
            </Select>
        </SidebarMenuFilterItem>
    );
}
