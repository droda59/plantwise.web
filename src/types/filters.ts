export const ZONES = ['0a', '0b', '1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'];
export const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
export const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
export const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
export const SALTS = ["haute", "moyenne", "faible"];
export const BLOOMS = ["printemps", "été", "automne"];

export interface Filters {
    q?: string;

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
    genus?: string;
    species?: string;
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
