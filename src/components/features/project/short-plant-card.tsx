'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/plant";
import { CodeChip } from "@/components/code-chip";
import { FunctionalGroupBadge } from "@/components/badges/functional-group-badge";
import { NativeBadge } from "@/components/badges/native-badge";

export const ShortPlantCard = ({ plant }: { plant: Plant }) => {
    return (
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="shadow-sm hover:shadow-lg transition rounded-xs py-4 gap-2">
                <CardHeader className="pb-0">
                    <div className='flex'>
                        <div className="grow">
                            <CardTitle className="text-base">
                                <Link href={`/plant/${plant.code}`}>
                                    <span className='italic'>{plant.species || plant.genus}</span>
                                    {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
                                    {plant.note && <span>&nbsp;({plant.note})</span>}
                                </Link>
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">{plant.commonName}</div>
                        </div>

                        <CodeChip plant={plant} />
                    </div>
                </CardHeader>
                <CardContent className="flex">
                    <div className="flex grow">
                        <FunctionalGroupBadge group={plant.functionalGroup} />
                        <NativeBadge isNative={plant.isNative} />
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
};
