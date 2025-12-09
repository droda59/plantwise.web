// const apiURL = 'https://plantwise-api.onrender.com';
const apiURL = 'http://localhost:3000';

export class groupApi {
    async getFunctionalGroups(): Promise<{ functionalGroup: string, genus: string, count: number }[]> {
        const response = await fetch(`${apiURL}/api/group`, {
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

export const groupApiInstance = new groupApi();