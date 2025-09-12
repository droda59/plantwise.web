'use client';

import React, { useEffect, useState } from 'react';

import { plantApiInstance } from '@/api/plant-api';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PLANTTYPES } from '@/types/plantType';
import { ZONES } from '@/types/hardiness-zone';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plant } from '@/types/plant';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function Import() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [canCreate, setCanCreate] = useState(false);
    const [codeExists, setCodeExists] = useState<boolean | undefined>(undefined);
    const [plant, setPlant] = useState<Plant>({
        code: '',
        latin: '',
        name: '',
        type: '1 AR',
    });

    useEffect(() => {
        setCanCreate(!!plant.code && !!plant.latin && !!plant.name && !!plant.type);
    }, [plant]);

    const createPlantAsync = async (plant: Plant) => {
        setLoading(true);

        const newPlant = await plantApiInstance.createPlant(plant);
        if (newPlant) {
            router.push(`/plant/${newPlant.code}`);
        }

        setLoading(false);
    };

    const fetchPlantAsync = async (plantCode: string) => {
        if (plantCode) {
            setCanCreate(false);

            const data = await plantApiInstance.getPlant(plantCode);

            setCodeExists(!!data);
            setCanCreate(!!data);
        }
    };

    const createPlant = () => {
        createPlantAsync(plant);
    };

    const fetchPlant = () => {
        fetchPlantAsync(plant.code);
    };

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                <h1 className='text-3xl font-semibold'>Créer une nouvelle plante</h1>
                {plant && (
                    <>
                        <div className="grid w-full max-w-sm items-center gap-3 mt-8">
                            <Label htmlFor="code">Code *</Label>
                            <div className='flex'>
                                <Input
                                    required
                                    type="text"
                                    id="code"
                                    placeholder="Code"
                                    value={plant.code || ''}
                                    onChange={(e) => setPlant(f => ({ ...f, code: e.target.value }))}
                                    onBlur={fetchPlant} />
                                {codeExists === true && <Badge variant='outline' className="ml-1 text-amber-600 rounded-xs">Le code existe déjà</Badge>}
                                {codeExists === false && <Badge variant='outline' className="ml-1 text-emerald-600 rounded-xs">Le code n'existe pas</Badge>}
                            </div>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Label htmlFor="latin">Nom latin *</Label>
                            <Input required type="text" id="latin" placeholder="Nom latin" value={plant.latin || ''} onChange={(e) => setPlant(f => ({ ...f, latin: e.target.value }))} />
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Label htmlFor="name">Nom vernaculaire *</Label>
                            <Input required type="text" id="name" placeholder="Nom vernaculaire" value={plant.name || ''} onChange={(e) => setPlant(f => ({ ...f, name: e.target.value }))} />
                        </div>

                        <Separator className='m8-8' />

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Label htmlFor="family">Famille</Label>
                            <Input type="text" id="family" placeholder="Famille" value={plant.family || ''} onChange={(e) => setPlant(f => ({ ...f, family: e.target.value }))} />
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Label htmlFor="genus">Genre</Label>
                            <Input type="text" id="genus" placeholder="Genre" value={plant.genus || ''} onChange={(e) => setPlant(f => ({ ...f, genus: e.target.value }))} />
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Label htmlFor="species">Espèce</Label>
                            <Input type="text" id="species" placeholder="Espèce" value={plant.species || ''} onChange={(e) => setPlant(f => ({ ...f, species: e.target.value }))} />
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Select value={plant.type} onValueChange={v => setPlant(f => ({ ...f, type: v }))}>
                                <SelectTrigger className="grow"><SelectValue placeholder='Type' /></SelectTrigger>
                                <SelectContent>
                                    {PLANTTYPES.sort((a, b) =>
                                        a['label'].localeCompare(b['label'])
                                    ).map((t, i) => (
                                        <SelectItem key={i} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Select value={plant.zone} onValueChange={v => setPlant(f => ({ ...f, zone: v }))}>
                                <SelectTrigger className="grow"><SelectValue placeholder='Zone' /></SelectTrigger>
                                <SelectContent>
                                    {ZONES.sort((a, b) =>
                                        a.localeCompare(b)
                                    ).map((t, i) => (
                                        <SelectItem key={i} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3 mt-4">
                            <Button disabled={!canCreate} onClick={createPlant}>Créer</Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
