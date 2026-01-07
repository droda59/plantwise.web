import { ValueLabelPair } from "./value-label";
import { Icon, IconChristmasTree, IconFlower, IconTree, IconWheat } from "@tabler/icons-react";

export type PlantTypeValue = "1 AR" | "1b ARB" | "2 CON" | "3 ARBU" | "4 VIV" | "5 GRAM" | "6 GRMP" | "7 FOU" | "8 AQUA" | "9 ANU" | "10 FH" | "11 ENS" | "12 BUL" | "13 MOU";

export interface PlantType extends ValueLabelPair<PlantTypeValue> {
    color: string,
    icon: Icon,
};

export const PLANTTYPES: Array<PlantType> = [
    {
        value: "1 AR",
        label: "Arbre feuillu",
        color: 'lightgreen',
        icon: IconTree,
    }, {
        value: "1b ARB",
        label: "Arbrisseau feuillu",
        color: 'lightgreen',
        icon: IconTree,
    }, {
        value: "2 CON",
        label: "Conifère",
        color: 'darkgreen',
        icon: IconChristmasTree,
    }, {
        value: "3 ARBU",
        label: "Arbuste",
        color: 'green',
        icon: IconTree,
    }, {
        value: "4 VIV",
        label: "Vivace",
        color: 'red',
        icon: IconFlower,
    }, {
        value: "5 GRAM",
        label: "Graminée",
        color: 'wheat',
        icon: IconWheat,
    },
    /*
    {
        value: "6 GRMP",
        label: "Grimpante",
        color: 'wheat',
    }, {
        value: "7 FOU",
        label: "Fougère",
        color: 'wheat',
    }, {
        value: "8 AQUA",
        label: "Aquatique",
        color: 'teal',
    }, {
        value: "10 FH",
        label: "Fines herbes",
        color: 'red',
    }, {
        value: "12 BUL",
        label: "Bulbe",
        color: 'pink',
    }, {
        value: "13 MOU",
        label: "Mousse",
        color: 'blue',
    }
    */
];

export function getPlantType(value: PlantTypeValue): PlantType {
    return PLANTTYPES.find(t => t.value === value) as PlantType;
};
