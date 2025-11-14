import Image from 'next/image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { HardinessZone } from '@/types/hardiness-zone';

export const HardinessZoneInfo = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className='w-180 rounded-sm'>
            <div className="flex flex-col justify-between gap-2">
                <h3 className="text-base font-semibold">Zones de rusticité</h3>
                <div className='flex'>
                    <div className='w-120'>
                        <Image
                            src='/carte-zones-rusticite-quebec-plantes.jpg'
                            width={300}
                            height={200}
                            alt='Carte des zones de rusticité' />
                    </div>
                    <div className='ml-2'>
                        <div className="text-xs">
                            <p className="mt-1">
                                La rusticité est une cote attribuée aux plantes vivaces basée sur leur capacité à résister au froid.
                            </p>
                            <p className="mt-1">
                                Les zones sont classées de 0 à 9 en fonction de diverses conditions climatiques, comme la température, les précipitations et la durée de la période de gel.
                            </p>
                            <p className="mt-1">
                                La zone 0 couvre les régions les plus froides du nord du pays, la zone 9 couvre les parties les plus chaudes de l'île de Vancouver.
                            </p>
                        </div>
                        <div className="mt-1 text-muted-foreground text-xs">
                            Source : Gouvernement du Canada
                        </div>
                    </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard >
);

export const PlantZoneInfo = ({ children, zone }: { children: React.ReactNode, zone?: HardinessZone }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        {!!zone && (
            <HoverCardContent className={`w-80 border-${zone.colorHex} rounded-sm`}>
                <div className="flex flex-col justify-between gap-2">
                    <h3 className="text-base font-semibold">Zone de rusticité {zone.value}</h3>
                    <div className="mt-1">
                        <p className="text-xs">
                            {zone.label}
                        </p>
                    </div>
                    <div className="mt-1 text-muted-foreground text-xs">
                        Source : Gouvernement du Canada
                    </div>
                </div>
            </HoverCardContent>
        )}
    </HoverCard>
);