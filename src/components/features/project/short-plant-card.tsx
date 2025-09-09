import { motion } from "framer-motion";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plant } from "@/types/plant";
import { getPlantType } from "@/types/plantType";
import { CodeChip } from "@/components/code-chip";

export const ShortPlantCard = ({ plant, count }: { plant: Plant, count: number }) => {
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

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-lg transition rounded-xs">
                <CardHeader className="pb-0">
                    <div className='flex'>
                        <div className="grow">
                            <CardTitle className="text-md">
                                <Link href={`/plant/${plant.code}`}>
                                    <span className='italic'>{latin}</span>
                                    {cultivar && <span>&nbsp;'{cultivar}'</span>}
                                </Link>
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">{plant.name}</div>
                        </div>

                        <CodeChip plant={plant} />
                    </div>
                </CardHeader>
                <CardContent className="flex">
                    <div className="flex grow">
                        {type && <Badge variant="secondary" className='rounded-xs'>{type.label}</Badge>}
                        {!!plant.functionalGroup && (
                            <Badge variant="secondary" className="ml-1 rounded-xs">Groupe&nbsp;{plant.functionalGroup}</Badge>
                        )}
                        {plant.isNative && (
                            <Badge className="ml-1 bg-emerald-100 text-emerald-700 rounded-xs">Indigène</Badge>
                        )}
                        {plant.isNaturalized && (
                            <Badge className="ml-1 bg-amber-100 text-amber-700 rounded-xs">Naturalisé</Badge>
                        )}
                    </div>
                    <div className='flex'>
                        x {count}
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
};
