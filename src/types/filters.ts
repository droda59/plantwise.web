export interface Filters {
    q: string;

    // Conditions du site
    zone?: string;
    soil?: string;
    sun?: string;
    saltConditions?: string;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;

    // Conditions de la plante
    type?: string;
    color?: string;
    bloom?: string;
    native?: boolean;
    height?: [number, number];
    spread?: [number, number];
    functionalGroup?: string;
};

export const DEFAULT_FILTERS: Filters = {
    q: '',

    // Conditions du site
    zone: undefined,
    soil: undefined,
    sun: undefined,
    saltConditions: undefined,
    droughtTolerant: undefined,
    floodTolerant: undefined,

    // Conditions de la plante
    type: undefined,
    color: undefined,
    bloom: undefined,
    native: undefined,
    height: [0, 3000],
    spread: [0, 3000],
    functionalGroup: undefined,
};
