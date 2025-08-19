export interface Plant {
    code: string;
    latin: string;
    name: string;
    type: PlantType;
    zone: [number, number]; // [min, max] hardiness zone (e.g., [3, 6])
    soil: Array<"sableux" | "limoneux" | "argileux" | "riche" | "pauvre" | "acide" | "alcalin">;
    sun: Array<"plein-soleil" | "mi-ombre" | "ombre">;
    native: boolean;
    height: number; // cm (approx)
    spread: number; // cm (approx)
    nurseries: Nursery[];
}

export type PlantType = "1 AR" | "1b ARB" | "2 CON" | "3 ARBU" | "4 VIV" | "5 GRAM" | "6 GRMP" | "7 FOU" | "8 AQUA" | "9 ANU" | "10 FH" | "11 ENS" | "12 BUL" | "13 MOU";

export interface Nursery {
    name: string;
    city: string;
    website: string;
}
