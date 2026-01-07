import React, { useEffect, useState } from 'react';
import { Plant } from "@/types/plant";
import { Button } from './ui/button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useProject } from './project-context';

export function CodeChip({ plant }: { plant: Plant }) {
    const { findInProject, addToProject, removeFromProject } = useProject();
    const [existing, setExisting] = useState<boolean>(false);

    useEffect(() => {
        const existing = findInProject(plant.code);
        setExisting(!!existing);
    }, [plant, findInProject]);

    const addPlant = () => {
        if (existing) {
            removeFromProject(plant);
        } else {
            addToProject(plant);
        }
    };

    return (
        <div className='flex relative codechip'>
            <div
                className='h-10 bg-foreground'
                style={{
                    aspectRatio: '1 / cos(30deg)',
                    '--b': '2px',
                    clipPath: 'polygon(0 50%, 50% -50%, 100% 50%, 50% 150%, 0 50%, var(--b) 50%, calc(25% + var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(75% - var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(100% - var(--b)) 50%, calc(75% - var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), calc(25% + var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), var(--b) 50%)',
                } as React.CSSProperties & Record<string, any>}
            />
            <span className='w-full absolute text-center top-0.5'>
                <Button variant='secondary' className='px-1 py-1' onClick={addPlant}>
                    <span className='text-xs'>{plant.code}</span>
                    {existing ? <IconMinus /> : <IconPlus />}
                </Button>
            </span>
        </div>
    );
}
