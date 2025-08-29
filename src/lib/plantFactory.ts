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
            soil: Array.isArray(data.soil) ? data.soil : (data.soil ? [data.soil] : []),
            sun: Array.isArray(data.sun) ? data.sun : (data.sun ? [data.sun] : []),
            isNative: Boolean(data.isNative),
            droughtTolerant: data.droughtTolerant ? Boolean(data.droughtTolerant) : undefined,
            floodTolerant: data.floodTolerant ? Boolean(data.floodTolerant) : undefined,
            height: Number(data.height) || 0,
            spread: Number(data.spread) || 0,
            saltTolerance: data.saltTolerance || undefined,
            // nurseries: Array.isArray(data.nurseries) ? data.nurseries : [],
        };
    }
}
