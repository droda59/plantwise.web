"use client";

import React from "react";
import { FunctionalGroup } from "@/types/functional-groups";

export const FunctionalGroupInfo = ({ group }: { group: FunctionalGroup }) => (
    <div className="flex flex-col justify-between gap-2">
        <h3 className="text-base font-semibold">Groupes fonctionnels</h3>
        <div className="mt-1">
            <h4 className="text-sm font-semibold">Groupe {group.value}</h4>
            <p className="text-xs">
                {group.description}
            </p>
            <p className="text-xs mt-1">
                ex. {group.species}
            </p>
        </div>
        <div className="mt-1 text-muted-foreground text-xs">
            Source : Jour de la Terre
        </div>
    </div>
);
