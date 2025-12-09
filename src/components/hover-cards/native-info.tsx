import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export const NativeInfo = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-sm">
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-base font-semibold">Plante indigène</h3>
                <div className="mt-1">
                    <p className="text-xs">
                        Plante qui pousse dans une zone donnée de l'aire de répartition globale de son espèce, sans intervention humaine.
                        <br />
                        En Amérique du Nord, on fait référence aux espèces qui existaient sur le continent avant la colonisation européenne.
                    </p>
                </div>
                <div className="mt-1 text-muted-foreground text-xs">
                    Source : Aiglon Indigo
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
);
