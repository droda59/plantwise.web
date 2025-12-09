// const apiURL = 'https://plantwise-api.onrender.com';
const apiURL = 'http://localhost:3000';

export class speciesApi {
    async getSpecies(): Promise<{ genus: string, species: string, count: number }[]> {
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