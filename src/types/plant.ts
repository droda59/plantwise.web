import { FunctionalGroupValue } from './functional-groups';
import { HardinessZoneValue } from './hardiness-zone';
import { PlantTypeValue } from './plantType';
import { SunConditionValue } from './sun-condition';

export interface Plant {
    id?: string;
    code: string;

    type: PlantTypeValue;

    zone?: HardinessZoneValue;
    isNative?: boolean;
    isNaturalized?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    // droughtTolerant?: boolean;
    // floodTolerant?: boolean;
    // saltTolerance?: 'haute' | 'moyenne' | 'faible';
    sunTolerance?: Array<SunConditionValue>;
    bloom?: number[];

    family: string;
    genus: string;
    species?: string;
    cultivar?: string;
    note?: string;
    synonym?: string;
    commonName: string;

    functionalGroup?: FunctionalGroupValue;

    vascanID?: string;
    urlJardin2M?: string;
}
