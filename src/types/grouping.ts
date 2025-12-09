import { ValueLabelPair } from "./value-label";

export type FunctionalGroupValue = 'Fruitier' | 'Grimpant' | 'Herbe';

export const GROUPINGS: Array<ValueLabelPair<FunctionalGroupValue>> = [
    {
        value: "Fruitier",
        label: "Fruitier comestible",
    }, {
        value: "Grimpant",
        label: "Plante grimpante",
    }, {
        value: "Herbe",
        label: "Herbe ornementale",
    }
];
