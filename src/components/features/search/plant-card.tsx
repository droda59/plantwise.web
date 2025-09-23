import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plant } from "@/types/plant";
import { getPlantType, PlantTypeValue } from "@/types/plantType";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import { CodeChip } from "../../code-chip";
import { cn } from "@/lib/utils"
import { getFunctionalGroup } from "@/types/functional-groups";

const SizeChip = ({ size }: { size?: number }) => {
    if (!size) return <span>Inconnue</span>;
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

const typeColors = {
    '1 AR': 'border-green-500',
    '1b ARB': 'border-lime-400',
    '2 CON': 'border-emerald-700',
    '3 ARBU': 'border-lime-400',
    '4 VIV': 'border-red-500',
    '5 GRAM': 'border-orange-200',
    '6 GRMP': 'border-red-500',
    '7 FOU': 'border-lime-300',
    '8 AQUA': 'border-cyan-500',
    '9 ANU': 'border-fuchsia-400',
    '10 FH': 'border-green-300',
    '11 ENS': 'border',
    '12 BUL': 'border-red-300k',
    '13 MOU': 'border',
};

const groupColors = {
    '1A': 'border-lime-700',
    '1B': 'border-lime-200',
    '2A': 'border-sky-500',
    '2B': 'border-sky-400',
    '2C': 'border-sky-300',
    '3A': 'border-amber-700',
    '3B': 'border-orange-300',
    '4A': 'border-yellow-500',
    '4B': 'border-yellow-200',
    '5': 'border-yellow-300',
};

export const PlantCard = ({ plant }: { plant: Plant; }) => {
    const originalName = plant.latin;
    const nameWithCultivar = plant.latin.split("'");

    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(plant.latin);

    const type = getPlantType(plant.type);
    const functionalGroup = getFunctionalGroup(plant.functionalGroup);

    var latin = originalName;
    var cultivar = undefined;
    if (nameWithCultivar.length > 1) {
        cultivar = nameWithCultivar[1];
        latin = nameWithCultivar[0].trim();
    } else if (matches) {
        latin = latin.substring(0, latin.indexOf('(')).trim();
    }

    const TypeChip = ({ chipType }: { chipType: PlantTypeValue }) => {
        function getChipBackgroundColor() {
            const style = {
                backgroundColor: '#262626',
                height: '4px',
            };

            if ((chipType === '1 AR' && (plant.type === '1 AR' || plant.type === '1b ARB'))
                || (chipType === '2 CON' && plant.type === '2 CON')
                || (chipType === '3 ARBU' && plant.type === '3 ARBU')
                || (chipType === '4 VIV' && (plant.type === '4 VIV' || plant.type === '10 FH'))
                || (chipType === '5 GRAM' && plant.type === '5 GRAM')
                || (chipType === '6 GRMP' && plant.type === '6 GRMP' || plant.type === '7 FOU')
                || (chipType === '8 AQUA' && plant.type === '8 AQUA')) {
                style.backgroundColor = getPlantType(plant.type).color;
            }

            return style;
        };

        return (
            <span className="flex grow" style={getChipBackgroundColor()} />
        );
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-lg transition rounded-xs relative">
                {/*
                <div className="flex w-full absolute top-0">
                    <TypeChip chipType='1 AR' />
                    <TypeChip chipType='2 CON' />
                    <TypeChip chipType='3 ARBU' />
                    <TypeChip chipType='4 VIV' />
                    <TypeChip chipType='5 GRAM' />
                    <TypeChip chipType='6 GRMP' />
                    <TypeChip chipType='8 AQUA' />
                </div>
                */}
                <CardHeader className="pb-2">
                    <div className='flex'>
                        <div className="grow">
                            <CardTitle className="text-lg">
                                <Link href={`/plant/${plant.code}`}>
                                    <span className='italic'>{latin}</span>
                                    {cultivar && <span>&nbsp;'{cultivar}'</span>}
                                </Link>
                                {/*{comment && <span> ({comment})</span>}*/}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">{plant.name}</div>
                        </div>

                        <CodeChip plant={plant} />
                    </div>
                </CardHeader>
                <CardContent className="grid">
                    <div className="flex mb-2">
                        {type && <Badge variant="outline" className={cn(typeColors[plant.type], 'text-card-foreground rounded-xs')}>{type.label}</Badge>}
                        {!!plant.functionalGroup && (
                            <Badge variant="outline" className={cn(functionalGroup ? groupColors[functionalGroup.value] : 'border', 'ml-1 text-card-foreground rounded-xs')}>Groupe&nbsp;{plant.functionalGroup}</Badge>
                        )}
                        {plant.isNative && (
                            <Badge variant='outline' className="ml-1 border-green-400 text-card-foreground rounded-xs">Indigène</Badge>
                        )}
                        {plant.isNaturalized && (
                            <Badge variant='outline' className="ml-1 border-amber-400 text-card-foreground rounded-xs">Naturalisé</Badge>
                        )}
                    </div>
                    <div className='text-sm text-muted grid grid-cols-2 mt-2'>
                        <div className='flex-col'>
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconWorld />&nbsp;
                                <span className="font-light">Zone</span>&nbsp;
                                <span className="font-medium">{plant.zone || 'Inconnue'}</span>
                            </div>
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconArrowsVertical />&nbsp;
                                <span className="font-light">Haut.</span>&nbsp;
                                <span className="font-medium"><SizeChip size={plant.height} /></span>
                            </div>
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconArrowsHorizontal />&nbsp;
                                <span className="font-light">Larg.</span>&nbsp;
                                <span className="font-medium"><SizeChip size={plant.spread} /></span>
                            </div>
                        </div>
                        <div className='flex-col'>
                            <div className='flex'>
                                <div className='flex-col'>
                                    {!!plant.family && <div className="font-light">Fam.</div>}
                                    {!!plant.genus && <div className="font-light">Genre</div>}
                                    {!!plant.species && <div className="font-light">Esp.</div>}
                                </div>
                                <div className='flex-col grow ml-4'>
                                    {!!plant.family && <div className="font-medium italic">{plant.family}</div>}
                                    {!!plant.genus && <div className="font-medium italic">{plant.genus}</div>}
                                    {!!plant.species && <div className="font-medium italic">{plant.species}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
};

export default PlantCard;