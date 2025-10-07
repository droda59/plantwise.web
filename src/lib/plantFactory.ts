import { SunConditionValue } from "@/types/sun-condition";
import { Plant } from "@/types/plant";

export class PlantFactory {
    static create(data: any): Plant {
        return {
            id: data.id,
            code: data.code,
            latin: data.latin,
            name: data.name,
            type: data.type,
            zone: data.zone,
            sunTolerance: !!data.sunTolerance ? String(data.sunTolerance).split(',').map(s => s.trim() as SunConditionValue) : [],
            isNative: data.native === 'i',
            isNaturalized: data.native === 'n',
            // droughtTolerant: data.droughtTolerant ? Boolean(data.droughtTolerant) : undefined,
            // floodTolerant: data.floodTolerant ? Boolean(data.floodTolerant) : undefined,
            // bloom: Array.isArray(data.bloom) ? data.bloom : (data.bloom ? [data.bloom] : []),
            height: Number(data.height) || 0,
            spread: Number(data.spread) || 0,
            // saltTolerance: data.saltTolerance || undefined,
            family: data.family,
            genus: data.genus,
            species: data.species,
            functionalGroup: data.functionalGroup,
        };
    }
}
