import { PlantTypeValue } from './plantType';

export interface Plant {
    id?: string;
    code: string;
    latin: string;
    name: string;
    family?: string;
    genus?: string;
    species?: string;
    type: PlantTypeValue;
    functionalGroup?: string;
    zone?: string;
    sun?: Array<'plein-soleil' | 'mi-ombre' | 'ombre'>;
    isNative?: boolean;
    isNaturalized?: boolean;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
    // nurseries?: Nursery[];
}

/*
export interface Nursery {
    name: string;
    city: string;
    website: string;
}
*/
