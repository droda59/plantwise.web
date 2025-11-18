import { formatMonthChip } from "@/lib/utils";
import { ValueLabelPair } from "./value-label";

export const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
export const SALTS = ["haute", "moyenne", "faible"];

export const MONTHS: Array<ValueLabelPair<string>> = [...Array(12).keys()].map(m => ({
    value: (m + 1).toString(),
    label: formatMonthChip(m + 1)
}));

export interface Filters {
    q?: string;

    // Critères du site
    zone?: string;
    sunConditions?: string[];
    // saltConditions?: string;
    // droughtTolerant?: boolean;
    // floodTolerant?: boolean;

    // Critères de la plante
    type?: string;
    functionalGroup?: string;
    // color?: string;
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
    // saltConditions: undefined,
    // droughtTolerant: undefined,
    // floodTolerant: undefined,

    // Critères de la plante
    type: undefined,
    functionalGroup: undefined,
    // color: undefined,
    bloom: undefined,
    height: [0, 3000],
    spread: [0, 3000],
    native: undefined,

    genus: undefined,
    species: undefined,
};
