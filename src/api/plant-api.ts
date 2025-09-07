import { PlantFactory } from "@/lib/plantFactory";
import { Filters } from "@/types/filters";
import { Plant } from "@/types/plant";

export function createSearchParams(filters?: Filters) {
    const params = new URLSearchParams();
    if (filters) {
        filters.q && params.set('q', filters.q.toLowerCase());
        filters.zone && filters.zone !== '.' && params.set('zone', filters.zone.toString());
        filters.soil && filters.soil !== '.' && params.set('soil', filters.soil);
        filters.sun && filters.sun !== '.' && params.set('sun', filters.sun);
        filters.saltConditions && params.set('saltConditions', filters.saltConditions);
        filters.droughtTolerant && params.set('droughtTolerant', 'true');
        filters.floodTolerant && params.set('floodTolerant', 'true');

        filters.type && filters.type !== '.' && params.set('type', filters.type);
        filters.color && filters.color !== '.' && params.set('color', filters.color);
        filters.bloom && filters.bloom !== '.' && params.set('bloom', filters.bloom);
        filters.native && params.set('native', 'true');
        if (filters.height) {
            filters.height[0] > 0 && params.set('heightMin', filters.height[0].toString());
            filters.height[1] < 3000 && params.set('heightMax', filters.height[1].toString());
        }
        if (filters.spread) {
            filters.spread[0] > 0 && params.set('spreadMin', filters.spread[0].toString());
            filters.spread[1] < 3000 && params.set('spreadMax', filters.spread[1].toString());
        }
        filters.functionalGroup && filters.functionalGroup !== '.' && params.set('functionalGroup', filters.functionalGroup);
        filters.species && filters.species !== '.' && params.set('species', filters.species);
    }

    return params;
}

export class plantApi {
    async getPlants(filters?: Filters): Promise<Plant[]> {
        const params = createSearchParams(filters);
        const query = filters && `?${params.toString()}` || '';
        const response = await fetch(`http://localhost:3000/api/plants${query}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return data.map(d => PlantFactory.create(d));
    }

    async getPlant(code: string): Promise<Plant> {
        const response = await fetch(`http://localhost:3000/api/plants/${code}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        const plant = PlantFactory.create(data);

        return plant;
    }

    async importPlants(): Promise<void> {
        await fetch(`http://localhost:3000/api/plants/import`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}

export const plantApiInstance = new plantApi();