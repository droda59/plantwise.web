"use client";

import React from "react";
import { FunctionalGroupValue } from "@/types/functional-groups";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { IconTrees } from "@tabler/icons-react";

const groupColors = {
    '1A': 'text-lime-700',
    '1B': 'text-lime-200',
    '2A': 'text-sky-500',
    '2B': 'text-sky-400',
    '2C': 'text-sky-300',
    '3A': 'text-amber-700',
    '3B': 'text-orange-300',
    '4A': 'text-yellow-500',
    '4B': 'text-yellow-200',
    '5': 'text-yellow-300',
};

export const FunctionalGroupBadge = ({ group }: { group?: FunctionalGroupValue }) => group &&
    <Badge variant="outline" className={cn(groupColors[group])}><IconTrees /> Groupe&nbsp;{group}</Badge>;
