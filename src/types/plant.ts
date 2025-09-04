import { PlantTypeValue } from './plantType';

export interface Plant {
    id: string;
    code: string;
    latin: string;
    name: string;
    family?: string;
    genus?: string;
    species?: string;
    type: PlantTypeValue;
    functionalGroup?: string;
    zone?: string;
    soil: Array<'sablonneux' | 'limoneux' | 'argileux' | 'riche' | 'pauvre' | 'acide' | 'alcalin' | 'organique' | 'tourbeux' | 'loam argileux' | 'loam sablonneux' | 'humifère' | 'graveleux'>;
    sun: Array<'plein-soleil' | 'mi-ombre' | 'ombre'>;
    isNative: boolean;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
    nurseries?: Nursery[];
}

export interface Nursery {
    name: string;
    city: string;
    website: string;
}
