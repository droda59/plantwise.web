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
}
