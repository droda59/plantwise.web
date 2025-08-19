import React, { useMemo, useState, useEffect, useRef } from "react";
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "@/components/SectionTitle";

const ZONES = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
const TYPES = ["arbre", "arbuste", "vivace", "annuelle", "graminée", "vigne", "couvre-sol", "comestible"];
const BLOOMS = ["printemps", "été", "automne"];
const prettySun = (s) => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

export function Filters({ filters, setFilters, total, onReset }) {
    const fileRef = useRef(null);
    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <SectionTitle icon={Filter} title="Filtres" subtitle={`${total} plante${total > 1 ? "s" : ""} trouvée${total > 1 ? "s" : ""}`} />
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid md:grid-cols-3 gap-3">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Zone (min)</label>
                        <Select value={filters.zoneMin ?? ""} onValueChange={(v) => setFilters(f => ({ ...f, zoneMin: v ? Number(v) : undefined }))}>
                            <SelectTrigger><SelectValue placeholder="min" /></SelectTrigger>
                            <SelectContent>{ZONES.map(z => (<SelectItem key={z} value={z}>{z}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Zone (max)</label>
                        <Select value={filters.zoneMax ?? ""} onValueChange={(v) => setFilters(f => ({ ...f, zoneMax: v ? Number(v) : undefined }))}>
                            <SelectTrigger><SelectValue placeholder="max" /></SelectTrigger>
                            <SelectContent>{ZONES.map(z => (<SelectItem key={z} value={z}>{z}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={filters.type || ""} onValueChange={(v) => setFilters(f => ({ ...f, type: v || undefined }))}>
                            <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {TYPES.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Sol</label>
                        <Select value={filters.soil || ""} onValueChange={(v) => setFilters(f => ({ ...f, soil: v || undefined }))}>
                            <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {SOILS.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Ensoleillement</label>
                        <Select value={filters.sun || ""} onValueChange={(v) => setFilters(f => ({ ...f, sun: v || undefined }))}>
                            <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Tous</SelectItem>
                                {SUNS.map(s => (<SelectItem key={s} value={s}>{prettySun(s)}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Couleur</label>
                        <Select value={filters.color || ""} onValueChange={(v) => setFilters(f => ({ ...f, color: v || undefined }))}>
                            <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {COLORS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Floraison</label>
                        <Select value={filters.bloom || ""} onValueChange={(v) => setFilters(f => ({ ...f, bloom: v || undefined }))}>
                            <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value=".">Toutes</SelectItem>
                                {BLOOMS.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Mot-clé</label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                            <Input className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch checked={!!filters.native} onCheckedChange={(v) => setFilters(f => ({ ...f, native: v || undefined }))} id="native" />
                        <label htmlFor="native" className="text-sm">Espèce indigène (Québec)</label>
                    </div>
                </div>
                {/* 
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button variant="secondary" onClick={onReset}><Settings2 className="w-4 h-4 mr-1" />Réinitialiser</Button>
                    <Button variant="outline" onClick={() => downloadCSV("resultats-plantes.csv", filters.__exportRows || [])}><Download className="w-4 h-4 mr-1" />Exporter CSV</Button>
                    <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const rows = await readCSV(file);
                        filters.__onImport && filters.__onImport(rows);
                        e.currentTarget.value = ""; // reset
                    }} />
                    <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-1" />Importer CSV</Button>
                </div> */}
            </CardContent>
        </Card>
    );
}
