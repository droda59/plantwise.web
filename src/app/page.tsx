'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CSVPlant, Nursery, Plant, PlantType } from '@/types/plant';
import { PlantCard } from '@/components/PlantCard';
import { SectionTitle } from '@/components/SectionTitle';
import { Filters } from '@/components/Filters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

/** @type {Nursery[]} */
const NURSERIES = [
    { name: 'Pépinière Boréale', city: 'Blainville', website: 'https://exemple-boreale.qc' },
    { name: 'Centre Jardin Laurentides', city: 'St-Jérôme', website: 'https://exemple-laurentides.qc' },
    { name: 'Jardin Botanix Rive-Nord', city: 'Laval', website: 'https://exemple-botanix.qc' },
];

/** @type {Plant[]} */
const STARTER_PLANTS = [
    {
        id: 'asclepias-tuberosa',
        code: 'ASC',
        name: 'Asclépiade tubéreuse',
        latin: 'Asclepias tuberosa',
        type: {
            value: '4 VIV',
            label: 'Vivace'
        },
        zone: 3,
        soil: ['sableux', 'pauvre', 'acide'],
        sun: ['plein-soleil'],
        // colors: ['orange'],
        // bloom: ['été'],
        isNative: true,
        saltTolerance: 'moyenne',
        height: 0.6,
        spread: 0.45,
        nurseries: [NURSERIES[0], NURSERIES[1]],
    },
    {
        id: 'acer-ginnala',
        code: 'ACG',
        name: "Érable de l'Amour",
        latin: 'Acer ginnala',
        type: {
            value: '1 AR',
            label: 'Arbre'
        },
        zone: 3,
        soil: ['limoneux', 'riche', 'acide', 'alcalin'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['vert', 'rouge automnal'],
        // bloom: ['printemps'],
        isNative: false,
        height: 6,
        spread: 5,
        nurseries: [NURSERIES[0]],
    },
    {
        id: 'vaccinium-angustifolium',
        code: 'VAA',
        name: 'Bleuet sauvage',
        latin: 'Vaccinium angustifolium',
        type: {
            value: '10 FH',
            label: 'Fines herbes'
        },
        zone: 2,
        soil: ['acide', 'sableux'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['blanc'],
        // bloom: ['printemps'],
        isNative: true,
        saltTolerance: 'haute',
        height: 0.3,
        spread: 1,
        nurseries: [NURSERIES[1]],
    },
    {
        id: 'hydrangea-paniculata',
        code: 'HYP',
        name: 'Hydrangée paniculée',
        latin: 'Hydrangea paniculata',
        type: {
            value: '3 ARBU',
            label: 'Arbuste'
        },
        zone: 3,
        soil: ['riche', 'limoneux'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['blanc', 'rose'],
        // bloom: ['été', 'automne'],
        isNative: false,
        saltTolerance: 'faible',
        height: 2,
        spread: 2,
        nurseries: [NURSERIES[2], NURSERIES[0]],
    },
    {
        id: 'thymus-serpyllum',
        code: 'THY',
        name: 'Thym serpolet',
        latin: 'Thymus serpyllum',
        type: {
            value: '10 FH',
            label: 'Fines herbes'
        },
        zone: 2,
        soil: ['pauvre', 'sableux'],
        sun: ['plein-soleil'],
        // colors: ['mauve', 'rose'],
        // bloom: ['été'],
        isNative: false,
        height: 0.08,
        spread: 0.5,
        nurseries: [NURSERIES[0]],
    },
];

/* function importRows(rows: CSVPlant[]) {
    // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
    const toPlant = (r, i) => {
        const cleanup = (x) => typeof x === 'string' ? x.trim() : x;
        const plantId = cleanup(r['CODE']) && cleanup(r['CODE']).concat(`import-${Date.now()}-${i}`);
        const isNative = String(r['indig/nat'] || '');
        // const arr = (x) => typeof x === 'string' ? x.split('|').map(s => s.trim()).filter(Boolean) : [];
        const p: Plant = {
            id: plantId,
            code: plantId,
            name: cleanup(r['Nom commun']) || `Plante importée ${i + 1}`,
            latin: cleanup(r['Nom BOTANIQUE']) || '',
            type: PlantTypes.find(v => v.value === cleanup(r['Type'])) || PlantTypes[0],
            zone: cleanup(r['Zone']) || 0,
            soil: [], // arr(r.soil),
            sun: [], // (arr(r.soleil)),
            // colors: arr(r.couleurs),
            // bloom: (arr(r.floraison)),
            isNative: isNative.startsWith('n') || isNative.startsWith('i'),
            height: cleanup(r['H']) || 0, //Number(r.height),
            spread: cleanup(r['L']) || 0,
            // nurseries: NURSERIES.slice(0, 1),
        };
        return p;
    };
    setAllPlants(prev => [...prev, ...rows.map(toPlant)]);
} */

const DEFAULT_FILTERS = {
    q: '',

    // Conditions du site
    zoneMin: undefined,
    zoneMax: undefined,
    soil: undefined,
    sun: undefined,
    saltConditions: '',

    // Conditions de la plante
    type: undefined,
    color: undefined,
    bloom: undefined,
    native: undefined,
    height: undefined,
    spread: undefined,
};

export default function Home() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [filteredPlants, setFilteredPlants] = useState([]);

    const [allPlants] = useState(() => STARTER_PLANTS);

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    const applyFilters = () => {
        const filteredPlants = allPlants.filter(plant => {
            if (filters.q) {
                const q = filters.q.toLowerCase();
                if (!(plant.name.toLowerCase().includes(q) || plant.latin.toLowerCase().includes(q))) return false;
            }
            if (filters.type && plant.type.value !== filters.type) return false;
            if (filters.soil && !plant.soil.includes(filters.soil)) return false;
            if (filters.sun && !plant.sun.includes(filters.sun)) return false;
            switch (filters.saltConditions) {
                case 'haute': if (plant.saltTolerance !== 'haute') return false;
                case 'moyenne': if (plant.saltTolerance !== 'haute' && plant.saltTolerance !== 'moyenne') return false;
                case 'faible': if (plant.saltTolerance !== 'haute' && plant.saltTolerance !== 'moyenne' && plant.saltTolerance !== 'faible') return false;
                default: break;
            }
            const plantHeight = plant.height * 100; // Convert to cm for comparison
            if (filters.height && (Array.isArray(filters.height) ? (plantHeight < filters.height[0] || plantHeight > filters.height[1]) : plantHeight !== filters.height)) return false;

            const plantSpread = plant.spread * 100; // Convert to cm for comparison
            if (filters.spread && (Array.isArray(filters.spread) ? (plantSpread < filters.spread[0] || plantSpread > filters.spread[1]) : plantSpread !== filters.spread)) return false;
            // if (filters.color && !plant.colors.includes(filters.color)) return false;
            // if (filters.bloom && !plant.bloom.includes(filters.bloom)) return false;
            if (filters.native && !plant.isNative) return false;
            // if (filters.zoneMin && plant.zone[1] < filters.zoneMin) return false;
            // if (filters.zoneMax && plant.zone[0] > filters.zoneMax) return false;
            return true;
        });

        setFilteredPlants(filteredPlants);
    };

    const filtered = useMemo(applyFilters, [allPlants]);

    return (
        <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
            <main className='flex flex-col gap-[32px] row-start-2 items-center '>
                <div className='flex items-center flex-col sm:flex-row'>
                    <img
                        className='dark:invert'
                        src='/reliefDesign.jpg'
                        alt='ReliefDesign logo'
                        width={300}
                    />
                    <span style={{
                        color: '#1b1b1b',
                        fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 'normal',
                    }}>
                        <span style={{
                            color: '#1b1b1b',
                        }}>PLANT</span>
                        <span style={{
                            color: '#1180be',
                        }}>FINDER</span>
                    </span>
                </div>

                <div className='flex gap-4 items-center flex-col sm:flex-row'>
                    <Filters filters={filters} setFilters={setFilters} onReset={resetFilters} onApplyFilters={applyFilters} />
                </div>

                <div className='md:col-span-2'>
                    <SectionTitle icon={Search} title='Résultats' subtitle={`${filteredPlants.length} plante${filteredPlants.length > 1 ? 's' : ''} trouvée${filteredPlants.length > 1 ? 's' : ''}`} />
                    <AnimatePresence mode='popLayout'>
                        <ScrollArea className='h-72 w-48 rounded-md'>
                            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
                                {filteredPlants.map((plant, index) => (
                                    <div key={index}>
                                        <PlantCard plant={plant} />
                                        <Separator className='my-2' />
                                    </div>
                                ))}
                                {filteredPlants.length === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-sm text-muted-foreground'>
                                        Aucune plante ne correspond. Essayez d'élargir les filtres.
                                    </motion.div>
                                )}
                            </div>
                        </ScrollArea>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
