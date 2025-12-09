import { formatMonthChip } from "@/lib/utils";
import { ValueLabelPair } from "./value-label";

export const MONTHS: Array<ValueLabelPair<string>> = [...Array(12).keys()].map(m => ({
    value: (m + 1).toString(),
    label: formatMonthChip(m + 1)
}));

export interface Filters {
    q?: string;

    // Critères du site
    zone?: string;
    sunConditions?: string[];

    // Critères de la plante
    type?: string;
    functionalGroup?: string;
    grouping?: string;
    bloom?: string;
    height?: [number, number];
    spread?: [number, number];
    native?: boolean;

    genus?: string;
    species?: string;
};

export const DEFAULT_FILTERS: Filters = {
    q: '',

    // Critères du site
    zone: undefined,
    sunConditions: undefined,

    // Critères de la plante
    type: undefined,
    functionalGroup: undefined,
    grouping: undefined,
    bloom: undefined,
    height: [0, 3000],
    spread: [0, 3000],
    native: undefined,

    genus: undefined,
    species: undefined,
};
