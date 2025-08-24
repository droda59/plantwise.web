import { Filters } from "@/types/filters";

export async function getPlants(filters?: Filters) {
    const params = new URLSearchParams();
    if (filters) {
        filters.q && params.append('q', filters.q.toLowerCase());
        filters.zone && filters.zone !== '.' && params.append('zone', filters.zone.toString());
        filters.soil && filters.soil !== '.' && params.append('soil', filters.soil);
        filters.sun && filters.sun !== '.' && params.append('sun', filters.sun);
        filters.saltConditions && params.append('saltConditions', filters.saltConditions);
        filters.droughtTolerant && params.append('droughtTolerant', 'true');
        filters.floodTolerant && params.append('floodTolerant', 'true');

        filters.type && filters.type !== '.' && params.append('type', filters.type);
        filters.color && filters.color !== '.' && params.append('color', filters.color);
        filters.bloom && filters.bloom !== '.' && params.append('bloom', filters.bloom);
        filters.native && params.append('native', 'true');
        filters.height && filters.height.length && params.append('heightMin', filters.height[0].toString());
        filters.height && filters.height.length && params.append('heightMax', filters.height[1].toString());
        filters.spread && filters.spread.length && params.append('spreadMin', filters.spread[0].toString());
        filters.spread && filters.spread.length && params.append('spreadMax', filters.spread[1].toString());
    }

    const query = filters && `?${params.toString()}` || '';
    const response = await fetch(`http://localhost:3000/api/plants${query}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    return data;
}
