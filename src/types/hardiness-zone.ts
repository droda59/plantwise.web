export type HardinessZoneValue = '0a' | '0b' | '1a' | '1b' | '2a' | '2b' | '3a' | '3b' | '4a' | '4b' | '5a' | '5b' | '6a' | '6b' | '7a' | '7b' | '8a' | '8b' | '9a';

export interface HardinessZone {
    value: HardinessZoneValue,
    city: string,
    colorHex: string,
};

export const ZONES: Array<HardinessZone> = [
    {
        value: "0a",
        city: "Cap-Chat, Havre-Aubert, Inukjuak",
        colorHex: '#8c1bc4',
    }, {
        value: "0b",
        city: "Kuujjuaq",
        colorHex: '#8c1bf6',
    }, {
        value: "1a",
        city: "Fermont, Radisson",
        colorHex: '#5cc9fa',
    }, {
        value: "1b",
        city: "Chisasibi, Eastmain, Waskaganish",
        colorHex: '#a3cafb',
    }, {
        value: "2a",
        city: "Amos, Chibougamau, Waswanipi",
        colorHex: '#5cc9ca',
    }, {
        value: "2b",
        city: "Dolbeau-Mistassini, Rouyn-Noranda, Val d'Or",
        colorHex: '#5cc99d',
    }, {
        value: "3a",
        city: "L'Ascension, Murdochville, Natashquan",
        colorHex: '#43972a',
    }, {
        value: "3b",
        city: "Alma, La Tuque, Saguenay",
        colorHex: '#5cc93b',
    }, {
        value: "4a",
        city: "Kamouraska, La Malbaie, Mont-Tremblant",
        colorHex: '#d6fe51',
    }, {
        value: "4b",
        city: "Baie St-Paul, Gaspé, Rivière-du-Loup",
        colorHex: '#d6fed0',
    }, {
        value: "5a",
        city: "Gatineau, Québec, Rimouski",
        colorHex: '#ffff54',
    }, {
        value: "5b",
        city: "Chateauguay, Granby, Laval",
        colorHex: '#ffffa5',
    }, {
        value: "6a",
        city: "Boucherville, Kahnawake, Montréal",
        colorHex: '#f7ce45',
    }, {
        value: "6b",
        city: "London ON",
        colorHex: '#f19e38',
    }, {
        value: "7a",
        city: "Toronto ON",
        colorHex: '#f19e9c',
    }, {
        value: "7b",
        city: "North Vancouver BC",
        colorHex: '#f19e9c',
    }, {
        value: "8a",
        city: "Abbotsford BC",
        colorHex: '#ea483f',
    }, {
        value: "8b",
        city: "Vancouver BC",
        colorHex: '#763836',
    }, {
        value: "9a",
        city: "Victoria BC",
        colorHex: '#ea48f7',
    },
];

export function getHardinessZone(value?: string): HardinessZone | undefined {
    if (!value) return;

    var zone = value;
    if (value === '0') zone = '0b';
    else if (value === '1') zone = '1b';
    else if (value === '2') zone = '2b';
    else if (value === '3') zone = '3b';
    else if (value === '4') zone = '4b';
    else if (value === '5') zone = '5b';
    else if (value === '6') zone = '6b';
    else if (value === '7') zone = '7b';
    else if (value === '8') zone = '8b';
    else if (value === '9') zone = '9a';

    return ZONES.find(t => t.value === zone);
};


// https://geoscan.nrcan.gc.ca/text/geoscan/fulltext/gid293828.pdf