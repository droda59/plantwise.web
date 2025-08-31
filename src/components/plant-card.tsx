import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nursery, Plant } from "@/types/plant";
import { getPlantType, PlantType, PLANTTYPES, PlantTypeValue } from "@/types/plantType";
import { IconArrowsHorizontal, IconArrowsVertical, IconWorld } from "@tabler/icons-react";

const prettySun = (s) => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

const NurseryChip = ({ n }: { n: Nursery }) => (
    <a href={n.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs rounded-full border px-2 py-1 hover:shadow-sm transition">
        <MapPin className="w-3 h-3" />
        <span>{n.name}</span>
        <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
);

const SizeChip = ({ size }: { size: number }) => {
    if (size < 1) return <span>{size * 100} cm</span>;
    return <span>{size} m</span>;
}

export const PlantCard = ({ plant }: { plant: Plant; }) => {
    const originalName = plant.latin;
    const nameWithCultivar = plant.latin.split("'");

    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(plant.latin);

    var latin = originalName;
    var cultivar = undefined;
    var comment = matches && matches[1];
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
        <div className='flex items-center w-full' style={{ position: 'relative', width: '44px' }}>
            <div style={{
                position: 'absolute',
                height: '40px',
                aspectRatio: '1 / cos(30deg)',
                background: 'blue',
                '--b': '2px',
                clipPath: 'polygon(0 50%, 50% -50%, 100% 50%, 50% 150%, 0 50%, var(--b) 50%, calc(25% + var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(75% - var(--b) * cos(60deg)) calc(100% - var(--b) * sin(60deg)), calc(100% - var(--b)) 50%, calc(75% - var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), calc(25% + var(--b) * cos(60deg)) calc(var(--b) * sin(60deg)), var(--b) 50%)',
            }} />
            <span className='flex w-full text-xs justify-center'>
                {plant.code}
            </span>
        </div>
    );

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-md transition rounded-xs" style={{ position: 'relative' }}>
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
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Badge variant="secondary" className='rounded-xs'>{getPlantType(plant.type).label}</Badge>
                            <CardTitle className="text-lg">
                                <span className="italic">{latin}</span>
                                {cultivar && <span> '{cultivar}'</span>}
                                {comment && <span> ({comment})</span>}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{plant.name}</p>
                            {/*<p className="text-sm text-muted-foreground">{plant.code}</p>*/}
                            <div style={{
                                position: 'absolute',
                                top: '21px',
                                right: '6px',
                            }}>
                                <CodeChip />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid">
                    {plant.isNative && (
                        <div className="text-sm">
                            <Badge className="bg-emerald-100 text-emerald-700">Indigène</Badge>
                        </div>
                    )}
                    {plant.zone && (
                        <div className="text-sm text-muted-foreground">
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconWorld />
                                &nbsp;
                                <span className='flex w-full'>
                                    <span className="text-sm font-medium"><b>Zone</b>&nbsp;{plant.zone}</span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        {!!plant.height && plant.height > 0 && (
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconArrowsVertical />
                                &nbsp;
                                <span className='flex w-full'>
                                    <span className="text-sm font-medium"><b>Hauteur</b>&nbsp;<SizeChip size={plant.height} /></span>
                                </span>
                            </div>
                        )}
                        {!!plant.spread && plant.spread > 0 && (
                            <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
                                <IconArrowsHorizontal />
                                &nbsp;
                                <span className='flex w-full'>
                                    <span className="text-sm font-medium"><b>Hauteur</b>&nbsp;<SizeChip size={plant.spread} /></span>
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* {plant.nurseries.map((n, i) => <NurseryChip key={n.name + i} n={n} />)} */}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
};

export default PlantCard;