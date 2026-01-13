import { SunConditionValue } from "@/types/sun-condition";
import { Plant } from "@/types/plant";
import { SoilHumidityValue, SoilRichnessValue, SoilStructureValue } from "@/types/soil-condition";

export class PlantFactory {
    static create(data: any): Plant {
        return {
            id: data.id,
            code: data.code,
            type: data.type,

            family: data.family,
            genus: data.genus,
            species: data.species,
            cultivar: data.cultivar,
            note: data.note,
            synonym: data.synonym,
            commonName: data.commonName,

            zone: data.zone,
            isNative: !!data.native,
            height: Number(data.height) || 0,
            spread: Number(data.spread) || 0,
            plantationDistance: Number(data.plantationDistance) || 0,

            sunTolerance: !!data.sunTolerance ? String(data.sunTolerance).split(',').map(s => s.trim() as SunConditionValue) : [],
            soilHumidity: !!data.soilHumidity ? String(data.soilHumidity).split(',').map(s => s.trim() as SoilHumidityValue) : [],
            soilRichness: !!data.soilRichness ? String(data.soilRichness).split(',').map(s => s.trim() as SoilRichnessValue) : [],
            soilStructure: !!data.soilStructure ? String(data.soilStructure).split(',').map(s => s.trim() as SoilStructureValue) : [],
            groundSaltTolerance: data.groundSaltTolerance,
            airSaltTolerance: data.airSaltTolerance,
            soilAcidity: data.soilAcidity,

            bloom: !!data.bloom ? String(data.bloom).split(' ').map(b => Number(b.trim())) : [],
            functionalGroup: data.functionalGroup,
            grouping: data.grouping,

            remarks: data.remarks,

            vascanID: data.vascanID,
            hydroID: data.hydroID,
            referenceUrl: data.referenceUrl,
        };
    }
}
