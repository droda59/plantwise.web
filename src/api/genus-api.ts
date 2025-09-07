import { PlantFactory } from "@/lib/plantFactory";
import { Filters } from "@/types/filters";
import { Plant } from "@/types/plant";

export function createSearchParams(genus: string) {
    const params = new URLSearchParams();
    if (genus) {
        genus && genus !== ' ' && params.set('genus', genus);
    }

    return params;
}

export class genusApi {
    async getGenus(): Promise<string[]> {
        const response = await fetch(`http://localhost:3000/api/genus`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return data;
    }

    async getSpecies(genus: string): Promise<string[]> {
        const response = await fetch(`http://localhost:3000/api/genus/${genus}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return data;
    }
}

export const genusApiInstance = new genusApi();