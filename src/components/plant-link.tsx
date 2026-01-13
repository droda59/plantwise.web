'use client';

import React from "react";
import Link from "next/link";
import { Plant } from "@/types/plant";
import { speciesFirstWord } from "@/lib/utils";

type PlantInfoProps = {
    plant: Plant;
    reduce?: boolean;
    className?: string;
};

export const PlantName = ({ plant, reduce = false }: PlantInfoProps) => (
    <>
        <span className='italic'>{plant.species ? reduce ? speciesFirstWord(plant.species) : plant.species : plant.genus}</span>
        {plant.cultivar && <span>&nbsp;'{plant.cultivar}'</span>}
        {plant.note && <span>&nbsp;({plant.note})</span>}
    </>
);

export const PlantLink = ({ plant, reduce = false, className }: PlantInfoProps) => (
    <Link href={`/plant/${plant.code}`} className={className}>
        <PlantName plant={plant} reduce={reduce} />
    </Link>
);
