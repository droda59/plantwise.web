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

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-md transition">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Badge variant="secondary">{getPlantType(plant.type).label}</Badge>
                            <CardTitle className="text-lg leading-tight">
                                <span className="italic">{latin}</span>
                                {cultivar && <span> '{cultivar}'</span>}
                                {comment && <span> ({comment})</span>}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{plant.name}</p>
                            <p className="text-sm text-muted-foreground">{plant.code}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {plant.zone && (
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Zone {plant.zone}</Badge>
                        </div>
                    )}
                    {plant.isNative && (
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-emerald-100 text-emerald-700">Indigène</Badge>
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        {!!plant.height && plant.height > 0 && <span className="mr-4"><b>Hauteur</b> <SizeChip size={plant.height} /></span>}
                        {!!plant.spread && plant.spread > 0 && <span><b>Largeur</b> <SizeChip size={plant.spread} /></span>}
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