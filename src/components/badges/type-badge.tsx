"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { getPlantType, PlantTypeValue } from "@/types/plantType";

export const TypeBadge = ({ type }: { type: PlantTypeValue }) => {
    const plantType = getPlantType(type);
    const IconComponent = plantType.icon;

    return type &&
        <Badge variant="outline" className='text-card-foreground'><IconComponent />{plantType.label}</Badge>;
};
