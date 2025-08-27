export type PlantTypeValue = "1 AR" | "1b ARB" | "2 CON" | "3 ARBU" | "4 VIV" | "5 GRAM" | "6 GRMP" | "7 FOU" | "8 AQUA" | "9 ANU" | "10 FH" | "11 ENS" | "12 BUL" | "13 MOU";
export type PlantTypeLabel = "Arbre" | "Arbrisseau feuillu" | "Conifère" | "Arbuste" | "Vivace" | "Graminée" | "Grimpante" | "Fougère" | "Aquatique" | "Annuelle" | "Fines herbes" | "Ensemencement" | "Bulbe" | "Mousse";

export interface PlantType {
    value: PlantTypeValue,
    label: PlantTypeLabel
};

export const PLANTTYPES: Array<PlantType> = [
    {
        value: "1 AR",
        label: "Arbre"
    }, {
        value: "1b ARB",
        label: "Arbrisseau feuillu"
    }, {
        value: "2 CON",
        label: "Conifère"
    }, {
        value: "3 ARBU",
        label: "Arbuste"
    }, {
        value: "4 VIV",
        label: "Vivace"
    }, {
        value: "5 GRAM",
        label: "Graminée"
    }, {
        value: "6 GRMP",
        label: "Grimpante"
    }, {
        value: "7 FOU",
        label: "Fougère"
    }, {
        value: "8 AQUA",
        label: "Aquatique"
    }, {
        value: "9 ANU",
        label: "Annuelle"
    }, {
        value: "10 FH",
        label: "Fines herbes"
    }, {
        value: "11 ENS",
        label: "Ensemencement"
    }, {
        value: "12 BUL",
        label: "Bulbe"
    }, {
        value: "13 MOU",
        label: "Mousse"
    }
];

export function getPlantType(value: PlantTypeValue): PlantType {
    return PLANTTYPES.find(t => t.value === value) as PlantType;
};
