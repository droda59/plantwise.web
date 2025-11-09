import { SunConditionValue } from "@/types/sun-condition";
import { Plant } from "@/types/plant";

export class PlantFactory {
    static create(data: any): Plant {
        return {
            id: data.id,
            code: data.code,

            type: data.type,

            zone: data.zone,
            isNative: data.native === 'i',
            isNaturalized: data.native === 'n',
            height: Number(data.height) || 0,
            spread: Number(data.spread) || 0,
            // droughtTolerant: data.droughtTolerant ? Boolean(data.droughtTolerant) : undefined,
            // floodTolerant: data.floodTolerant ? Boolean(data.floodTolerant) : undefined,
            // saltTolerance: data.saltTolerance || undefined,
            sunTolerance: !!data.sunTolerance ? String(data.sunTolerance).split(',').map(s => s.trim() as SunConditionValue) : [],
            bloom: !!data.bloom ? String(data.bloom).split(',').map(b => Number(b.trim())) : [],

            family: data.family,
            genus: data.genus,
            species: data.species,
            cultivar: data.cultivar,
            note: data.note,
            synonym: data.synonym,
            commonName: data.commonName,

            functionalGroup: data.functionalGroup,

            vascanID: data.vascanID,
            urlJardin2M: data.urlJardin2M,
        };
    }
}
