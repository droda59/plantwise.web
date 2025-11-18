"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { SidebarMenuFilterItem } from "./filter-item";
import { Icon, IconProps } from "@tabler/icons-react";
import { ValueLabelPair } from "@/types/value-label";

interface ISelectProps {
    title: any;
    placeholder: string;
    options: ValueLabelPair<string>[];
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    selectedValues?: string[];
    setSelectedValues: (value: React.SetStateAction<any>) => void;
    disabled?: boolean;
}
export const FilterItemMultiSelect = ({
    title,
    placeholder,
    options,
    selectedValues,
    setSelectedValues,
    icon,
    disabled,
}: ISelectProps) => {
    const handleSelectChange = (value: string) => {
        if (!selectedValues) {
            setSelectedValues([value]);
        } else if (!selectedValues.includes(value)) {
            setSelectedValues([...selectedValues || [], value]);
        } else {
            const referencedArray = [...selectedValues || []];
            const indexOfItemToBeRemoved = referencedArray.indexOf(value);
            referencedArray.splice(indexOfItemToBeRemoved, 1);
            setSelectedValues(referencedArray);
        }
    };

    const isOptionSelected = (value: string): boolean => {
        return selectedValues && selectedValues.includes(value) ? true : false;
    };

    return (
        <SidebarMenuFilterItem icon={icon} title={title} disabled={disabled}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="grow">
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-between rounded-xs border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground dark:bg-input/10 dark:hover:bg-input/30 flex w-fit"
                    >
                        <div>
                            {selectedValues?.length
                                ? selectedValues.length === options.length
                                    ? placeholder
                                    : options.filter(value => isOptionSelected(value.value)).map(value => value.label).join(', ')
                                : placeholder}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {options.map((value: ISelectProps["options"][0], index: number) => (
                        <DropdownMenuCheckboxItem
                            onSelect={(e) => e.preventDefault()}
                            key={index}
                            checked={isOptionSelected(value.value)}
                            onCheckedChange={() => handleSelectChange(value.value)}
                        >
                            {value.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuFilterItem>
    );
};
