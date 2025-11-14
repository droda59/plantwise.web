import { FunctionalGroup } from "@/types/functional-groups";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export const FunctionalGroupInfo = ({ children, group }: { children: React.ReactNode, group: FunctionalGroup }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className={`w-80 border-${group.color} rounded-sm`}>
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
        </HoverCardContent>
    </HoverCard>
);
