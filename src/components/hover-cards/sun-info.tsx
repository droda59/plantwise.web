import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export const SunInfo = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-sm">
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-base font-semibold">Ensoleillement</h3>
                <div className="mt-1">
                    <h4 className="text-sm font-semibold">Plein soleil</h4>
                    <p className="text-xs">
                        Plus de 6h d'ensoleillement direct aux heures les plus chaudes de la journée.
                    </p>
                </div>
                <div className="mt-1">
                    <h4 className="text-sm font-semibold">Mi-ombre</h4>
                    <p className="text-xs">
                        Entre 3h et 6h d'ensoleillement direct par jour. Les variétés de mi-ombre n'apprécient pas la lumière naturelle directe aux heures les plus chaudes.
                    </p>
                </div>
                <div className="mt-1">
                    <h4 className="text-sm font-semibold">Ombre</h4>
                    <p className="text-xs">
                        Moins de 3h de soleil par jour.
                    </p>
                </div>
                <div className="mt-1 text-muted-foreground text-xs">
                    Source : Espace pour la vie, Monstera
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
);
