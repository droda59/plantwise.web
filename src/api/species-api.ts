export class speciesApi {
    async getSpecies(): Promise<{ genus: string, species: string }[]> {
        const response = await fetch(`http://localhost:3000/api/species/all`, {
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

export const speciesApiInstance = new speciesApi();