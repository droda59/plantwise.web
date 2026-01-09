"use client";

import React from "react";
import { FunctionalGroupValue, getFunctionalGroup } from "@/types/functional-groups";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { IconTrees } from "@tabler/icons-react";

export const FunctionalGroupBadge = ({ group }: { group?: FunctionalGroupValue }) => group &&
    <Badge variant="outline" className={cn(`text-${getFunctionalGroup(group)?.color}`)}><IconTrees /> Groupe&nbsp;{group}</Badge>;
