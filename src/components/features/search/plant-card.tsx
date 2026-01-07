import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/plant";
import { getPlantType } from "@/types/plantType";
import { IconArrowsHorizontal, IconArrowsVertical, IconChevronDown, IconChevronUp, IconSunHigh, IconSunHighFilled, IconSunOff, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import { CodeChip } from "../../code-chip";
import { speciesFirstWord } from "@/lib/utils"
import { getFunctionalGroup } from "@/types/functional-groups";
import { SizeChip } from "@/components/size-chip";
import { Button } from "@/components/ui/button";
import { getSunConditionValue } from "@/types/sun-condition";
import { FunctionalGroupBadge } from "@/components/badges/functional-group-badge";
import { NativeBadge } from "@/components/badges/native-badge";
import { TypeBadge } from "@/components/badges/type-badge";


type PlantInfo = { plant: Plant };

const PlantLink = ({ plant, reduce = false }: { reduce?: boolean } & PlantInfo) => (
    <Link href={`/plant/${plant.code}`}>
        <span className='italic'>{plant.species ? reduce ? speciesFirstWord(plant.species) : plant.species : plant.genus}</span>
        {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
        {plant.note && <span>&nbsp;({plant.note})</span>}
    </Link>
);

const SunInfo = ({ plant }: PlantInfo) => (
    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
        <span className="font-light">Soleil</span>&nbsp;
        {!plant.sunTolerance?.length && <span className="font-medium">Inconnu</span>}
        {plant.sunTolerance?.includes('full') && <IconSunHighFilled title={getSunConditionValue('full')} />}
        {plant.sunTolerance?.includes('partial') && <IconSunHigh title={getSunConditionValue('partial')} />}
        {plant.sunTolerance?.includes('shade') && <IconSunOff title={getSunConditionValue('shade')} />}
    </div>
);

const ZoneInfo = ({ plant }: PlantInfo) => (
    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
        <IconWorld />&nbsp;
        <span className="font-light">Zone</span>&nbsp;
        <span className="font-medium">{plant.zone || 'Inconnue'}</span>
    </div>
);

const HeightInfo = ({ plant }: PlantInfo) => (
    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
        <IconArrowsVertical />&nbsp;
        <span className="font-light">Haut.</span>&nbsp;
        <span className="font-medium"><SizeChip size={plant.height} /></span>
    </div>
);

const SpreadInfo = ({ plant }: PlantInfo) => (
    <div className='flex items-center overflow-hidden [&>svg]:size-4 [&>svg]:shrink-0'>
        <IconArrowsHorizontal />&nbsp;
        <span className="font-light">Larg.</span>&nbsp;
        <span className="font-medium"><SizeChip size={plant.spread} /></span>
    </div>
);

export const PlantCard = ({ plant }: PlantInfo) => {
    const type = getPlantType(plant.type);
    const functionalGroup = getFunctionalGroup(plant.functionalGroup);

    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-lg transition rounded-xs relative">
                <CardHeader className="pb-2">
                    <div className='flex'>
                        <div className="grow">
                            <CardTitle className="text-lg">
                                <PlantLink plant={plant} />
                            </CardTitle>
                            {plant.synonym && <div className="text-sm text-muted-foreground">syn.&nbsp;<span className='italic'>{plant.synonym}</span></div>}
                            {plant.commonName && <div className="text-sm text-muted-foreground">{plant.commonName}</div>}
                        </div>

                        <CodeChip plant={plant} />
                    </div>
                </CardHeader>
                <CardContent className="grid">
                    <div className="flex mb-2">
                        <TypeBadge type={plant.type} />
                        <FunctionalGroupBadge group={plant.functionalGroup} />
                        <NativeBadge isNative={plant.isNative} />
                    </div>
                    <div className='text-sm text-muted grid grid-cols-2 mt-2'>
                        <div className='flex-col'>
                            <ZoneInfo plant={plant} />
                            <SunInfo plant={plant} />
                        </div>
                        <div className='flex-col'>
                            <HeightInfo plant={plant} />
                            <SpreadInfo plant={plant} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
};

export const PlantListCard = ({ plants }: { plants: Plant[]; }) => {
    const firstPlant = plants[0];
    const [isExpanded, setExpanded] = useState<boolean>(false);

    return (
        <Card className="shadow-sm hover:shadow-lg transition rounded-xs relative">
            <CardHeader >
                <div className='flex'>
                    <div className="grow">
                        <CardTitle className="text-lg">
                            <span className='italic'>{firstPlant.species || firstPlant.genus}</span>
                        </CardTitle>
                        {firstPlant.synonym && <div className="text-sm text-muted-foreground">syn.&nbsp;<span className='italic'>{firstPlant.synonym}</span></div>}
                        {firstPlant.commonName && <div className="text-sm text-muted-foreground">{firstPlant.commonName}</div>}
                    </div>

                    <Button className='ml-2' variant='outline' size='icon' onClick={() => setExpanded(!isExpanded)}>
                        {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid">
                <div className="flex">
                    <TypeBadge type={firstPlant.type} />
                    <FunctionalGroupBadge group={firstPlant.functionalGroup} />
                    <NativeBadge isNative={firstPlant.isNative} />
                </div>

                {isExpanded && plants?.map((e, i) => (
                    <motion.div key={i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className='mt-2 px-4 py-2 flex hover:bg-accent'>
                            <div className='grow'>
                                <div className="grow text-sm">
                                    <PlantLink plant={e} reduce />
                                </div>
                                <div className='text-sm text-muted grid grid-cols-2 mt-2'>
                                    <div className='flex-col'>
                                        <ZoneInfo plant={e} />
                                        <SunInfo plant={e} />
                                    </div>
                                    <div className='flex-col'>
                                        <HeightInfo plant={e} />
                                        <SpreadInfo plant={e} />
                                    </div>
                                </div>
                            </div>
                            <CodeChip plant={e} />
                        </div>
                    </motion.div >
                ))}
            </CardContent>
        </Card>
    );
};
