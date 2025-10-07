export type SunConditionValue = 'full' | 'partial' | 'shade';
export type SunConditionLabel = 'Plein soleil' | 'Mi-ombre' | 'Ombre';

export interface SunCondition {
    value: SunConditionValue,
    label: SunConditionLabel,
};

export const SUNCONDITIONS: Array<SunCondition> = [
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
