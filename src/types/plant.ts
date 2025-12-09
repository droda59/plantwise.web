import { FunctionalGroupValue } from './functional-groups';
import { HardinessZoneValue } from './hardiness-zone';
import { PlantTypeValue } from './plantType';
import { SoilHumidityValue, SoilRichnessValue, SoilStructureValue } from './soil-condition';
import { SunConditionValue } from './sun-condition';

export interface Plant {
    id?: string;
    code: string;
    type: PlantTypeValue;

    family: string;
    genus: string;
    species?: string;
    cultivar?: string;
    note?: string;
    synonym?: string;
    commonName: string;

    zone?: HardinessZoneValue;
    isNative?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    plantationDistance?: number; // m (approx)

    sunTolerance?: Array<SunConditionValue>;
    soilHumidity?: Array<SoilHumidityValue>;
    soilRichness?: Array<SoilRichnessValue>;
    soilStructure?: Array<SoilStructureValue>;
    groundSaltTolerance?: string;
    airSaltTolerance?: string;
    soilAcidity?: string;

    bloom?: number[];
    functionalGroup?: FunctionalGroupValue;
    grouping: string;

    remarks?: string;

    vascanID?: string;
    hydroID?: string;
    referenceUrl?: string;
}
