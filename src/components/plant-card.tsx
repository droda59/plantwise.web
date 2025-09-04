import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nursery, Plant } from "@/types/plant";
import { getPlantType, PlantType, PLANTTYPES, PlantTypeValue } from "@/types/plantType";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";
import Link from "next/link";

const prettySun = (s) => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

const NurseryChip = ({ n }: { n: Nursery }) => (
    <a href={n.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs rounded-full border px-2 py-1 hover:shadow-sm transition">
        <MapPin className="w-3 h-3" />
        <span>{n.name}</span>
        <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
);

const SizeChip = ({ size }: { size?: number }) => {
    if (!size) return <span>Inconnue</span>;
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

export const PlantCard = ({ plant }: { plant: Plant; }) => {
    const originalName = plant.latin;
    const nameWithCultivar = plant.latin.split("'");

    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(plant.latin);

    const type = getPlantType(plant.type);

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
                backgroundColor: 'lightgrey',
                height: '4px',
            };

            if (chipType === '1 AR' && (plant.type === '1 AR' || plant.type === '1b ARB')) style.backgroundColor = 'lightgreen';
            else if (chipType === '2 CON' && plant.type === '2 CON') style.backgroundColor = 'darkgreen';
            else if (chipType === '3 ARBU' && plant.type === '3 ARBU') style.backgroundColor = 'green';
            else if (chipType === '4 VIV' && (plant.type === '4 VIV' || plant.type === '10 FH')) style.backgroundColor = 'red';
            else if (chipType === '5 GRAM' && plant.type === '5 GRAM') style.backgroundColor = 'wheat';
            else if (chipType === '6 GRMP' && plant.type === '6 GRMP' || plant.type === '7 FOU') style.backgroundColor = 'wheat';
            else if (chipType === '8 AQUA' && plant.type === '8 AQUA') style.backgroundColor = 'teal';

            return style;
        };

        return (
            <span className="flex grow" style={getChipBackgroundColor()} />
        );
    };

    const CodeChip = () => (
        <div className='flex items-center relative'>
            <div className='h-10 bg-primary' style={{
                aspectRatio: '1 / cos(30deg)',
                '--b': '2px',
                clipPath: 'polygon(0 50%, 50% -50%, 100% 50%, 50% 150%, 0 50%, var(--b) 50%, calc(25% + var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(75% - var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(100% - var(--b)) 50%, calc(75% - var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), calc(25% + var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), var(--b) 50%)',
            }} />
            <span className='text-xs w-full absolute text-center'>
                {plant.code}
            </span>
        </div>
    );

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-lg transition rounded-xs" style={{ position: 'relative' }}>
                <div className="flex w-full" style={{
                    position: 'absolute',
                    top: 0
                }}>
                    <TypeChip chipType='1 AR' />
                    <TypeChip chipType='2 CON' />
                    <TypeChip chipType='3 ARBU' />
                    <TypeChip chipType='4 VIV' />
                    <TypeChip chipType='5 GRAM' />
                    <TypeChip chipType='6 GRMP' />
                    <TypeChip chipType='8 AQUA' />
                </div>
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

                        <CodeChip />
                    </div>
                </CardHeader>
                <CardContent className="grid">
                    <div className="flex mb-2">
                        {type && <Badge variant="secondary" className='rounded-xs'>{type.label}</Badge>}
                        {!!plant.functionalGroup && (
                            <Badge variant="secondary" className="ml-1 rounded-xs">Groupe&nbsp;{plant.functionalGroup}</Badge>
                        )}
                        {plant.isNative && (
                            <Badge className="ml-1 bg-emerald-100 text-emerald-700 rounded-xs">Indigène</Badge>
                        )}
                    </div>
                    <div className='text-sm text-muted-foreground grid grid-cols-2 mt-2'>
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
                    <div className="flex flex-wrap gap-2">
                        {/* {plant.nurseries.map((n, i) => <NurseryChip key={n.name + i} n={n} />)} */}
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
};

export default PlantCard;