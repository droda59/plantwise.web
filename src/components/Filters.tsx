import React, { useMemo, useState, useEffect, useRef } from "react";
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2, SearchIcon, XCircleIcon } from "lucide-react";
import { parse } from "csv-parse";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "@/components/SectionTitle";
import { PlantType } from "@/types/plant";

const PLANTTYPES: Array<PlantType> = [
    {
        value: "1 AR",
        label: "Arbre"
    }, {
        value: "1b ARB",
        label: "Arbrisseau feuillu"
    }, {
        value: "2 CON",
        label: "Conifère"
    }, {
        value: "3 ARBU",
        label: "Arbuste"
    }, {
        value: "4 VIV",
        label: "Vivace"
    }, {
        value: "5 GRAM",
        label: "Graminée"
    }, {
        value: "6 GRMP",
        label: "Grimpante"
    }, {
        value: "7 FOU",
        label: "Fougère"
    }, {
        value: "8 AQUA",
        label: "Aquatique"
    }, {
        value: "9 ANU",
        label: "Annuelle"
    }, {
        value: "10 FH",
        label: "Fines herbes"
    }, {
        value: "11 ENS",
        label: "Ensemencement"
    }, {
        value: "12 BUL",
        label: "Bulbe"
    }, {
        value: "13 MOU",
        label: "Mousse"
    }];

const ZONES = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
const SALTS = ["haute", "moyenne", "faible"];
const BLOOMS = ["printemps", "été", "automne"];
const prettySun = (s) => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

function readCSV(file) {
    return new Promise((resolve, reject) => {
        const processFile = async () => {
            const records = [];
            const parser = fs.createReadStream(file).pipe(
                parse({
                    // CSV options if any
                }),
            );
            for await (const record of parser) {
                // Work with each record
                records.push(record);
            }
            return records;
        };

        (async () => {
            const records = await processFile();
            console.info(records);
        })();



        /*  const reader = new FileReader();
         reader.onload = () => {
             try {
                 const text = (reader.result);
                 const rows = parse(
                     text,
                     {
                         skip_records_with_empty_values: true,
                     }
                 );
                 const [headerLine, ...lines] = text.trim().split(/\r?\n/);
                 const headers = headerLine.split(",").map(h => h.replace(/^"|"$/g, ""));
                 const rows = lines.map(l => {
                     // very simple CSV, assumes no embedded commas except within quotes
                     // const cols = l.match(/((?:\"[^\"]*\")|[^,])+/g)?.map(x => x.replace(/^"|"$/g, "").replaceAll("\\\"", "\"")) || [];
                     const o = {};
                     const data = l.split(',');
                     if (data.length == headers.length) {
                         headers.forEach((h, i) => o[h] = data[i]);
                     }
                     //                     headers.forEach((h, i) => o[h] = l[i]);
                     return o;
                 });
 
                 resolve(rows.slice(0, 500));
             } catch (e) { reject(e); }
         };
         reader.onerror = reject;
         reader.readAsText(file); */
    });
}

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

export function Filters({ filters, setFilters, onReset, onApplyFilters }) {
    const fileRef = useRef(null);
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
                            <label className="text-sm font-medium">Présence de sels</label>
                            <Select value={filters.saltConditions || ""} onValueChange={(v) => setFilters(f => ({ ...f, saltConditions: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Toutes</SelectItem>
                                    {SALTS.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.droughtTolerant} onCheckedChange={(v) => setFilters(f => ({ ...f, droughtTolerant: v || undefined }))} id="droughtTolerant" />
                            <label htmlFor="droughtTolerant" className="text-sm">Sujet à la sécheresse</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.floodTolerant} onCheckedChange={(v) => setFilters(f => ({ ...f, floodTolerant: v || undefined }))} id="floodTolerant" />
                            <label htmlFor="floodTolerant" className="text-sm">Sujet à l'excès d'eau</label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        Conditions de la plante

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select value={filters.type || ""} onValueChange={(v) => setFilters(f => ({ ...f, type: v || undefined }))}>
                                <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Tous</SelectItem>
                                    {PLANTTYPES.map((t, i) => (<SelectItem key={i} value={t.value}>{t.label}</SelectItem>))}
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

                        {/* Ajouter text fields pour la recherche */}
                        {/* Granulariser la slider, genre 0-2m en cm, 2-10m en 0.1m, 10+m en 1m */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Hauteur <SizeChip size={filters.height} /></label>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={(v) => setFilters(f => ({ ...f, height: v || undefined }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Largeur <SizeChip size={filters.spread} /></label>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                defaultValue={[0, 3000]}
                                onValueChange={(v) => setFilters(f => ({ ...f, spread: v || undefined }))}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch checked={!!filters.native} onCheckedChange={(v) => setFilters(f => ({ ...f, native: v || undefined }))} id="native" />
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
                {/* <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const rows = await readCSV(file);
                        filters.__onImport && filters.__onImport(rows);
                        // e.currentTarget && e.currentTarget.value = ""; // reset
                    }} />
                    <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-1" />Importer CSV</Button> */}

                {/*                     <div className="flex flex-wrap items-center pt-1">
                        <a
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SearchIcon className="w-4 h-4 mr-1" />
                            <img
                                className="dark:invert"
                                src="/vercel.svg"
                                alt="Vercel logomark"
                                width={20}
                                height={20}
                            />
                            Rechercher
                        </a>
                    </div> */}
            </CardFooter>
        </Card>
    );
}
