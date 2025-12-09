import { ValueLabelPair } from "./value-label";

export type SoilHumidityValue = 'dry' | 'regular' | 'wet';

export const getSoilHumidityValue = (soil: SoilHumidityValue) => ({
    dry: 'Sol sec',
    regular: 'Sol normal',
    wet: 'Sol humide'
}[soil]);

export const SOILHUMIDITY: Array<ValueLabelPair<SoilHumidityValue>> = [
    {
        value: "dry",
        label: getSoilHumidityValue('dry'),
    }, {
        value: "regular",
        label: getSoilHumidityValue('regular'),
    }, {
        value: "wet",
        label: getSoilHumidityValue('wet'),
    },
];

export type SoilRichnessValue = 'poor' | 'regular' | 'rich';

export const getSoilRichnessValue = (soil: SoilRichnessValue) => ({
    poor: 'Sol sec',
    regular: 'Sol normal',
    rich: 'Sol humide'
}[soil]);

export const SOILRICHNESS: Array<ValueLabelPair<SoilRichnessValue>> = [
    {
        value: "poor",
        label: getSoilRichnessValue('poor'),
    }, {
        value: "regular",
        label: getSoilRichnessValue('regular'),
    }, {
        value: "rich",
        label: getSoilRichnessValue('rich'),
    },
];

export type SoilStructureValue = 'sandy' | 'regular' | 'heavy';

export const getSoilStructureValue = (soil: SoilStructureValue) => ({
    sandy: 'Sol sablonneux',
    regular: 'Sol meuble',
    heavy: 'Sol lourd'
}[soil]);

export const SOILSTRUCTURE: Array<ValueLabelPair<SoilStructureValue>> = [
    {
        value: "sandy",
        label: getSoilStructureValue('sandy'),
    }, {
        value: "regular",
        label: getSoilStructureValue('regular'),
    }, {
        value: "heavy",
        label: getSoilStructureValue('heavy'),
    },
];
