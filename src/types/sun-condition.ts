import { ValueLabelPair } from "./value-label";

export type SunConditionValue = 'full' | 'partial' | 'shade';

export const SUNCONDITIONS: Array<ValueLabelPair<SunConditionValue>> = [
    {
        value: "full",
        label: "Plein soleil",
    }, {
        value: "partial",
        label: "Mi-ombre",
    }, {
        value: "shade",
        label: "Ombre",
    },
];
