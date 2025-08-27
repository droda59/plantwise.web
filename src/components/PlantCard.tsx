import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nursery, Plant } from "@/types/plant";
import { getPlantType } from "@/types/plantType";

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
    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-md transition">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Badge variant="secondary">{getPlantType(plant.type).label}</Badge>
                            <CardTitle className="text-lg italic leading-tight">{plant.latin}</CardTitle>
                            <p className="text-sm text-muted-foreground">{plant.name}</p>
                            <p className="text-sm text-muted-foreground">{plant.code}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Zone {plant.zone}</Badge>
                        {/* {plant.sun.map(s => <Badge key={s}>{prettySun(s)}</Badge>)} */}
                        {/* {plant.colors.slice(0, 3).map(c => <Badge key={c} variant="outline">{c}</Badge>)} */}
                        {plant.isNative && <Badge className="bg-emerald-100 text-emerald-700">Indigène</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {plant.height > 0 && <span className="mr-4"><b>Hauteur</b> <SizeChip size={plant.height} /></span>}
                        {plant.spread > 0 && <span><b>Largeur</b> <SizeChip size={plant.spread} /></span>}
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