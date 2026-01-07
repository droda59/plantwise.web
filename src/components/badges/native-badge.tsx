"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { IconLeaf } from "@tabler/icons-react";

export const NativeBadge = ({ isNative }: { isNative?: boolean }) => isNative &&
    <Badge variant='outline' className="text-green-400"><IconLeaf className='text-green-400' /> Indigène</Badge>
