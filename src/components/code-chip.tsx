import React, { useEffect, useState } from 'react';
import { Plant } from "@/types/plant";
import { Button } from './ui/button';
import { IconClipboardList, IconPlus } from '@tabler/icons-react';
import { useProject } from './project-context';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function CodeChip({ plant }: { plant: Plant }) {
    const { findInProject, addToProject, updateQuantity } = useProject();
    const [existing, setExisting] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const existing = findInProject(plant.code);
        setExisting(!!existing);

        if (existing) {
            setQuantity(existing.quantity);
        }
    }, [plant, findInProject]);

    const addPlant = () => {
        if (existing) {
            updateQuantity(plant.code, quantity);
        } else {
            addToProject(plant, quantity);
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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant='secondary' className='px-1 py-1'>
                            <span className='text-xs'>{plant.code}</span>
                            <IconPlus />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 rounded-sm">
                        <div className="flex flex-col justify-between gap-2">
                            <h3 className="text-base font-semibold">Ajouter cette plante au projet</h3>
                            <h4 className="text-muted-foreground text-sm">
                                <span className='italic'>{plant.species ? plant.species : plant.genus}</span>
                                {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
                                {plant.note && <span>&nbsp;({plant.note})</span>}
                            </h4>
                            <div className="mt-4 flex items-center gap-2 pl-2 text-left text-sm [&>svg]:size-4 [&>svg]:shrink-0">
                                <IconClipboardList />
                                <Label htmlFor="width" className=''>Quantité</Label>
                                <Input
                                    id="width"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/10 dark:hover:bg-input/30 flex w-fit items-center justify-between gap-2 rounded-xs border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 overflow-hidden"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <PopoverClose asChild>
                                    <Button variant="ghost" className="">Annuler</Button>
                                </PopoverClose>
                                <PopoverClose asChild>
                                    <Button className="ml-2" onClick={addPlant}>{existing ? "Modifier" : "Ajouter"}</Button>
                                </PopoverClose>
                            </div>
                        </div >
                    </PopoverContent>
                </Popover>
            </span>
        </div>
    );
}
