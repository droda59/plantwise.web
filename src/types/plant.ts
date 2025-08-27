import { PlantTypeValue } from './plantType';

export interface CSVPlant {
    code: string;
    quantity: string;
    latin: string;
    type: PlantTypeValue;
    name: string;
    calibre: string;
    ctocDistance: string;
    comment: string;
    zone: string; // hardiness zone (e.g., 3)
    sunFull: string; // 'oui' or 'non'
    sunFullPartial: string; // 'oui' or 'non'
    sunPartial: string; // 'oui' or 'non'
    sunShade: string; // 'oui' or 'non'
    humidity1: string; // 'oui' or 'non'
    humidity2: string; // 'oui' or 'non'
    humidity3: string; // 'oui' or 'non'
    soil: string;
    ph: string;
    height: number; // cm (approx)
    spread: number; // cm (approx)
    floweringMonths: string;
    native: boolean;
    dangers: string;
}

export interface Plant {
    id: string;
    code: string;
    latin: string;
    name: string;
    type: PlantTypeValue;
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
