export type FunctionalGroupValue = "1A" | "1B" | "2A" | "2B" | "2C" | "3A" | "3B" | "4A" | "4B" | "5";

export interface FunctionalGroup {
    value: FunctionalGroupValue,
    label: string
};

export const FUNCTIONALGROUPS: Array<FunctionalGroup> = [
    {
        value: "1A",
        label: "Confières, tolérant ombre"
    }, {
        value: "1B",
        label: "Pins intolérant ombre, tolérant sécheresse"
    }, {
        value: "2A",
        label: "Tolérant ombre, feuilles larges et minces"
    }, {
        value: "2B",
        label: "Maronniers"
    }, {
        value: "2C",
        label: "Grands arbres tolérant inondation"
    }, {
        value: "3A",
        label: "Petits arbres tolérant sécheresse"
    }, {
        value: "3B",
        label: "Groupe moyen intolérant inondation"
    }, {
        value: "4A",
        label: "Grands, semences et bois lourds, tolérant sécheresse"
    }, {
        value: "4B",
        label: "Légumineuses"
    }, {
        value: "5",
        label: "Croissance rapide, tolérant inondation"
    }
];

export function getPlantType(value: FunctionalGroupValue): FunctionalGroup {
    return FUNCTIONALGROUPS.find(t => t.value === value) as FunctionalGroup;
};
