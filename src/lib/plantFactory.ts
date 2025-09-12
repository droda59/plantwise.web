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
            sun: Array.isArray(data.sun) ? data.sun : (data.sun ? [data.sun] : []),
            isNative: data.native === 'i',
            isNaturalized: data.native === 'n',
            droughtTolerant: data.droughtTolerant ? Boolean(data.droughtTolerant) : undefined,
            floodTolerant: data.floodTolerant ? Boolean(data.floodTolerant) : undefined,
            height: Number(data.height) || 0,
            spread: Number(data.spread) || 0,
            saltTolerance: data.saltTolerance || undefined,
            family: data.family,
            genus: data.genus,
            species: data.species,
            functionalGroup: data.functionalGroup,
            // nurseries: Array.isArray(data.nurseries) ? data.nurseries : [],
        };
    }
}
