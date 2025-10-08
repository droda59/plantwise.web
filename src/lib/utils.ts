import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSizeChip(size: number): string {
    if (size > 100) return `${size / 100} m`;
    return `${size} cm`;
}

const monthLookup: Record<number, string> = {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',
};
export function formatMonthChip(month: number): string {
    return monthLookup[month] ?? '';
}
