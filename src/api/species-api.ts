const apiURL = 'https://plantwise-api.onrender.com';

export class speciesApi {
    async getSpecies(): Promise<{ genus: string, species: string }[]> {
        const response = await fetch(`${apiURL}/api/species/all`, {
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