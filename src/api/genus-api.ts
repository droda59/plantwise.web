// const apiURL = 'https://plantwise-api.onrender.com';
const apiURL = 'http://localhost:3000';

export class genusApi {
    async getGenus(): Promise<{ genus: string, count: number }[]> {
        const response = await fetch(`${apiURL}/api/genus`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return data;
    }

    async getSpecies(genus: string): Promise<{ species: string, count: number }[]> {
        const response = await fetch(`${apiURL}/api/genus/${genus}`, {
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