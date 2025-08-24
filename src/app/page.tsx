'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { PlantCard } from '@/components/PlantCard';
import { SectionTitle } from '@/components/SectionTitle';
import { PlantFilters } from '@/components/PlantFilters';
import { Separator } from '@/components/ui/separator';
import { getPlants } from '@/api/plantApi';
import { Filters } from '@/types/filters';

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

const DEFAULT_FILTERS: Filters = {
    q: '',

    // Conditions du site
    zone: undefined,
    soil: undefined,
    sun: undefined,
    saltConditions: undefined,
    droughtTolerant: undefined,
    floodTolerant: undefined,

    // Conditions de la plante
    type: undefined,
    color: undefined,
    bloom: undefined,
    native: undefined,
    height: [0, 3000],
    spread: [0, 3000],
};

export default function Home() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPlants = async (filters?: Filters) => {
        setFilteredPlants([]);
        setLoading(true);

        const data = await getPlants(filters);

        setFilteredPlants(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const resetFilters = () => setFilters(DEFAULT_FILTERS);
    const applyFilters = () => fetchPlants(filters);

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
                    <PlantFilters filters={filters} setFilters={setFilters} onReset={resetFilters} onApplyFilters={applyFilters} />
                </div>

                <div className='md:col-span-2'>
                    <SectionTitle icon={Search} title='Résultats' subtitle={loading ? 'Chargement des plantes...' : `${filteredPlants.length} plante${filteredPlants.length > 1 ? 's' : ''} trouvée${filteredPlants.length > 1 ? 's' : ''}`} />

                    {!loading &&
                        <AnimatePresence mode='popLayout'>
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
                        </AnimatePresence>
                    }
                </div>
            </main>
        </div>
    );
}
