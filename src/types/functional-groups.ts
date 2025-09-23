export type FunctionalGroupValue = "1A" | "1B" | "2A" | "2B" | "2C" | "3A" | "3B" | "4A" | "4B" | "5";

export interface FunctionalGroup {
    value: FunctionalGroupValue,
    label: string,
    description: string,
    species: string,
    color: string,
    colorHex: string,
};

export const FUNCTIONALGROUPS: Array<FunctionalGroup> = [
    {
        value: "1A",
        label: "Conifères, tolérant ombre",
        description: "Conifères généralement tolérants à l'ombre, mais pas à la sécheresse ou l'inondation. Mycorhization ECM et graine dispersées par le vent.",
        species: "Les épinettes, sapins et thuya, et le pin blanc",
        color: 'lime-700', // '#70ad46'
        colorHex: '#70ad46',
    }, {
        value: "1B",
        label: "Pins intolérant ombre, tolérant sécheresse",
        description: "Conifères héliophiles, tolérants à la sécheresse (pins). Mycorhization ECM et graine dispersées surtout par le vent.",
        species: "Les pins, melèzes, genévriers, et ginkgo",
        color: 'lime-200', // '#c5e0b3'
        colorHex: '#c5e0b3',
    }, {
        value: "2A",
        label: "Tolérant ombre, feuilles larges et minces",
        description: "Climaciques. Arbres tolérants à l'ombre à feuilles larges et minces, croissance moyenne. Mycorhization mixte et graine dispersées par le vent surtout.",
        species: "Les plupart des érables, les tilleuls, magnolia, le hêtre, ostryer et quelques autres petits arbres",
        color: 'sky-500', // '#2f74b7'
        colorHex: '#2f74b7',
    }, {
        value: "2B",
        label: "Maronniers",
        description: "Ressemblent à 2A sauf pour les semences très lourdes et dispersées par gravité. Mycorhization AM exclusive.",
        species: "Les marronniers",
        color: 'sky-400', // '#5a9bd3'
        colorHex: '#5a9bd3',
    }, {
        value: "2C",
        label: "Grands arbres tolérant inondation",
        description: "Grands arbres tolérants à l'inondation. Mycorhization AM et dispersion surtout par le vent.",
        species: "La plupart des ormes, les frênes, micocoulier, érables rouge, argenté, et negundo",
        color: 'sky-300', // '#bcd6ef'
        colorHex: '#bcd6ef',
    }, {
        value: "3A",
        label: "Petits arbres tolérant sécheresse",
        description: "Petits arbres tolérants à la sécheresse, bois lourd, feuilles épaisses, croissance faible. Mycorhization mixte (surtout AM). Zoochorie sauf les lilas (achorie).",
        species: "Rosacées (sorbier, poirier, aubépine et amélanchier), et les lilas",
        color: 'amber-700', // '#ed7d31'
        colorHex: '#ed7d31',
    }, {
        value: "3B",
        label: "Groupe moyen intolérant inondation",
        description: "Groupe « moyen ». Intolérant à l'inondation, mycorhization AM. Dispersées surtout par les animaux.",
        species: "Grandes Rosacées (cerisier, pommier), Catalpa, Maackia, autres espèces diverses",
        color: 'orange-300', // '#f4b083'
        colorHex: '#f4b083',
    }, {
        value: "4A",
        label: "Grands, semences et bois lourds, tolérant sécheresse",
        description: "Grands arbres à semences et bois lourds. Plusieurs tolérants à la sécheresse. Mycorhization surtout ECM; zoochorie.",
        species: "Les chênes, noyers, et caryers",
        color: 'yellow-500', // '#ffc000'
        colorHex: '#ffc000',
    }, {
        value: "4B",
        label: "Légumineuses",
        description: "Grande tolérantes à sécheresse, pas à l'ombre ou inondation. Semences lourdes, feuilles riches. Mycorhization surtout AM et zoochorie.",
        species: "Les légumineuses (févier, chicot, robinier, gainier)",
        color: 'yellow-200', // '#fed966'
        colorHex: '#fed966',
    }, {
        value: "5",
        label: "Croissance rapide, tolérant inondation",
        description: "Espèces pionnières à très petites semences. Croissance rapide, tolérants à l'inondation, bois léger. Mycorhization mixte (souvent double); anémochorie.",
        species: "Tous les peupliers, saules, aulnes et bouleaux (sauf jaune)",
        color: 'yellow-300', // '#ffff00'
        colorHex: '#ffff00',
    }
];

export function getFunctionalGroup(value?: string): FunctionalGroup | undefined {
    return FUNCTIONALGROUPS.find(t => t.value === value);
};
