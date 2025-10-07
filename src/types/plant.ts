import { PlantTypeValue } from './plantType';
import { SunConditionValue } from './sun-condition';

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
    sunTolerance?: Array<SunConditionValue>;
    isNative?: boolean;
    isNaturalized?: boolean;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    bloom?: number[];
    height?: number; // m (approx)
    spread?: number; // m (approx)
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
}
