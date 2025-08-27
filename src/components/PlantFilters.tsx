import React from "react";
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2, SearchIcon, XCircleIcon } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "@/components/SectionTitle";
import { Filters } from "@/types/filters";
import { PLANTTYPES } from "@/types/plantType";

const ZONES = ['0a', '0b', '1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'];
const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
const SALTS = ["haute", "moyenne", "faible"];
const BLOOMS = ["printemps", "été", "automne"];
const prettySun = s => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

const SizeLabel = ({ size }: { size: number }) => {
    if (size > 100) return <span>{size / 100} m</span>;
    return <span>{size} cm</span>;
}

const SizeChip = ({ size }: { size: number[] }) => {
    if (!size || !size.length) return false;
    return (
        <span>
            <SizeLabel size={size[0]} /> - <SizeLabel size={size[1]} />
        </span>
    );
}

export function PlantFilters({ filters, setFilters, onReset, onApplyFilters }:
    {
        filters: Filters,
        setFilters: React.Dispatch<React.SetStateAction<Filters>>,
        onReset: () => void,
        onApplyFilters: () => void
    }) {
    return (
        <Card className="">
            <CardHeader>
                <SectionTitle icon={Filter} title="Filtres" />
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
                    </div>
                </div>

                <div className="grid gap-2">
                    Conditions du site

                    <div className="grid md:grid-cols-3 gap-3">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Zone</label>
                            <Select value={filters.zone ?? ""} onValueChange={v => setFilters(f => ({ ...f, zone: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Toutes</SelectItem>
                                    {ZONES.map(z => (<SelectItem key={z} value={z}>{z}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Sol</label>
                            <Select value={filters.soil || ""} onValueChange={v => setFilters(f => ({ ...f, soil: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Tous</SelectItem>
                                    {SOILS.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Ensoleillement</label>
                            <Select value={filters.sun || ""} onValueChange={v => setFilters(f => ({ ...f, sun: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Tous</SelectItem>
                                    {SUNS.map(s => (<SelectItem key={s} value={s}>{prettySun(s)}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Présence de sels</label>
                            <Select value={filters.saltConditions || ""} onValueChange={v => setFilters(f => ({ ...f, saltConditions: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Toutes</SelectItem>
                                    {SALTS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.droughtTolerant} onCheckedChange={v => setFilters(f => ({ ...f, droughtTolerant: v || undefined }))} id="droughtTolerant" />
                            <label htmlFor="droughtTolerant" className="text-sm">Sujet à la sécheresse</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.floodTolerant} onCheckedChange={v => setFilters(f => ({ ...f, floodTolerant: v || undefined }))} id="floodTolerant" />
                            <label htmlFor="floodTolerant" className="text-sm">Sujet à l'excès d'eau</label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        Conditions de la plante

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select value={filters.type || ""} onValueChange={v => setFilters(f => ({ ...f, type: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Tous</SelectItem>
                                    {PLANTTYPES.map((t, i) => (<SelectItem key={i} value={t.value}>{t.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Couleur</label>
                            <Select value={filters.color || ""} onValueChange={v => setFilters(f => ({ ...f, color: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Toutes</SelectItem>
                                    {COLORS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Floraison</label>
                            <Select value={filters.bloom || ""} onValueChange={v => setFilters(f => ({ ...f, bloom: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Toutes</SelectItem>
                                    {BLOOMS.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ajouter text fields pour la recherche */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Hauteur <SizeChip size={filters.height} /></label>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={v => setFilters(f => ({ ...f, height: v || undefined }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Largeur <SizeChip size={filters.spread} /></label>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={v => setFilters(f => ({ ...f, spread: v || undefined }))}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.native} onCheckedChange={v => setFilters(f => ({ ...f, native: v || undefined }))} id="native" />
                            <label htmlFor="native" className="text-sm">Espèce indigène</label>
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" type="submit" onClick={onApplyFilters}>
                    <SearchIcon className="w-4 h-4 mr-1" />
                    Rechercher
                </Button>
                <Button className="w-full" variant="outline" onClick={onReset}>
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Réinitialiser
                </Button>
            </CardFooter>
        </Card>
    );
}
