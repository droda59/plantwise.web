"use client";

import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export const HoverInfo = ({ trigger, content, className }: { trigger: React.ReactNode, content: React.ReactNode, className?: string }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            <span className='cursor-help'>
                {trigger}
            </span>
        </HoverCardTrigger>
        <HoverCardContent className={`w-80 rounded-sm ${className}`}>
            {content}
        </HoverCardContent>
    </HoverCard>
);
