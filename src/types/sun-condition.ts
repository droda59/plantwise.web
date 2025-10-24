import { ValueLabelPair } from "./value-label";

export type SunConditionValue = 'full' | 'partial' | 'shade';

export const getSunConditionValue = (sun: SunConditionValue) => ({
    full: 'Plein soleil',
    partial: 'Mi-ombre',
    shade: 'Ombre'
}[sun]);

export const SUNCONDITIONS: Array<ValueLabelPair<SunConditionValue>> = [
    {
        value: "full",
        label: getSunConditionValue('full'),
    }, {
        value: "partial",
        label: getSunConditionValue('partial'),
    }, {
        value: "shade",
        label: getSunConditionValue('shade'),
    },
];
