"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Québec Plant Finder – MVP (client-side only)
 * -------------------------------------------------
 * ✅ Multi-criteria filtering (zone, sol, ensoleillement, couleur, type, floraison, natif)
 * ✅ Résultats avec fiches plantes et liens vers pépinières (exemples fictifs)
 * ✅ Favoris (localStorage)
 * ✅ Export CSV (résultats courants)
 * ✅ Import CSV (ajout à la base locale)
 * ✅ Design propre (Tailwind + shadcn/ui) et animations (Framer Motion)
 *
 * 🔧 Intégration ultérieure (serveur) suggérée dans TODO plus bas.
 */

// -----------------------------
// Types (JS Doc pour rester en JS pur tout en documentant)
// -----------------------------

/**
 * @typedef {Object} Nursery
 * @property {string} name
 * @property {string} city
 * @property {string} website
 * @property {"in"|"low"|"out"} stock
 */

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {string} name
 * @property {string} latin
 * @property {"arbre"|"arbuste"|"vivace"|"annuelle"|"graminée"|"vigne"|"couvre-sol"|"comestible"} type
 * @property {[number, number]} zone // [min,max] zone de rusticité (ex: [3,6])
 * @property {Array<"sableux"|"limoneux"|"argileux"|"riche"|"pauvre"|"acide"|"alcalin">} soil
 * @property {Array<"plein-soleil"|"mi-ombre"|"ombre">} sun
 * @property {string[]} colors // couleurs de floraison/principales
 * @property {Array<"printemps"|"été"|"automne">} bloom
 * @property {boolean} native
 * @property {number} height // cm (approx)
 * @property {number} spread // cm (approx)
 * @property {Nursery[]} nurseries
 */

// -----------------------------
// Données d'exemple (à remplacer par vos sources)
// -----------------------------

/** @type {Nursery[]} */
const NURSERIES = [
  { name: "Pépinière Boréale", city: "Blainville", website: "https://exemple-boreale.qc", stock: "in" },
  { name: "Centre Jardin Laurentides", city: "St-Jérôme", website: "https://exemple-laurentides.qc", stock: "low" },
  { name: "Jardin Botanix Rive-Nord", city: "Laval", website: "https://exemple-botanix.qc", stock: "out" },
];

/** @type {Plant[]} */
const STARTER_PLANTS = [
  {
    id: "asclepias-tuberosa",
    name: "Asclépiade tubéreuse",
    latin: "Asclepias tuberosa",
    type: "vivace",
    zone: [3, 6],
    soil: ["sableux", "pauvre", "acide"],
    sun: ["plein-soleil"],
    colors: ["orange"],
    bloom: ["été"],
    native: true,
    height: 60,
    spread: 45,
    nurseries: [NURSERIES[0], NURSERIES[1]],
  },
  {
    id: "acer-ginnala",
    name: "Érable de l'Amour",
    latin: "Acer ginnala",
    type: "arbre",
    zone: [3, 7],
    soil: ["limoneux", "riche", "acide", "alcalin"],
    sun: ["plein-soleil", "mi-ombre"],
    colors: ["vert", "rouge automnal"],
    bloom: ["printemps"],
    native: false,
    height: 600,
    spread: 500,
    nurseries: [NURSERIES[0]],
  },
  {
    id: "vaccinium-angustifolium",
    name: "Bleuet sauvage",
    latin: "Vaccinium angustifolium",
    type: "couvre-sol",
    zone: [2, 6],
    soil: ["acide", "sableux"],
    sun: ["plein-soleil", "mi-ombre"],
    colors: ["blanc"],
    bloom: ["printemps"],
    native: true,
    height: 30,
    spread: 100,
    nurseries: [NURSERIES[1]],
  },
  {
    id: "hydrangea-paniculata",
    name: "Hydrangée paniculée",
    latin: "Hydrangea paniculata",
    type: "arbuste",
    zone: [3, 8],
    soil: ["riche", "limoneux"],
    sun: ["plein-soleil", "mi-ombre"],
    colors: ["blanc", "rose"],
    bloom: ["été", "automne"],
    native: false,
    height: 200,
    spread: 200,
    nurseries: [NURSERIES[2], NURSERIES[0]],
  },
  {
    id: "thymus-serpyllum",
    name: "Thym serpolet",
    latin: "Thymus serpyllum",
    type: "couvre-sol",
    zone: [2, 7],
    soil: ["pauvre", "sableux"],
    sun: ["plein-soleil"],
    colors: ["mauve", "rose"],
    bloom: ["été"],
    native: false,
    height: 8,
    spread: 50,
    nurseries: [NURSERIES[0]],
  },
];

// -----------------------------
// Utilitaires
// -----------------------------
const ZONES = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SOILS = ["sableux", "limoneux", "argileux", "riche", "pauvre", "acide", "alcalin"];
const SUNS = ["plein-soleil", "mi-ombre", "ombre"];
const COLORS = ["blanc", "jaune", "orange", "rouge", "rose", "mauve", "bleu", "vert", "rouge automnal"];
const TYPES = ["arbre", "arbuste", "vivace", "annuelle", "graminée", "vigne", "couvre-sol", "comestible"];
const BLOOMS = ["printemps", "été", "automne"];

const prettySun = (s) => ({"plein-soleil":"Plein soleil","mi-ombre":"Mi-ombre","ombre":"Ombre"}[s]||s);

function downloadCSV(filename, rows) {
  const processVal = (v) => Array.isArray(v) ? v.join("|") : (typeof v === "object" && v !== null ? JSON.stringify(v) : (v ?? ""));
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(processVal(r[h])).replaceAll('"','\"')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function readCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = /** @type {string} */(reader.result);
        const [headerLine, ...lines] = text.trim().split(/\r?\n/);
        const headers = headerLine.split(",").map(h => h.replace(/^"|"$/g, ""));
        const rows = lines.map(l => {
          // very simple CSV, assumes no embedded commas except within quotes
          const cols = l.match(/((?:\"[^\"]*\")|[^,])+/g)?.map(x => x.replace(/^"|"$/g, "").replaceAll("\\\"","\"")) || [];
          const o = {};
          headers.forEach((h, i) => o[h] = cols[i]);
          return o;
        });
        resolve(rows);
      } catch (e) { reject(e); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// -----------------------------
// Composants UI
// -----------------------------
function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function NurseryChip({ n }) {
  const label = n.stock === "in" ? "En stock" : n.stock === "low" ? "Stock limité" : "Rupture";
  return (
    <a href={n.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs rounded-full border px-2 py-1 hover:shadow-sm transition">
      <MapPin className="w-3 h-3" />
      <span>{n.name}</span>
      <span className={`ml-1 ${n.stock === "in" ? "text-green-600" : n.stock === "low" ? "text-amber-600" : "text-rose-600"}`}>• {label}</span>
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
}

function PlantCard({ p, onToggleFav, isFav }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg leading-tight">{p.name}</CardTitle>
              <p className="text-sm italic text-muted-foreground">{p.latin}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onToggleFav(p.id)} aria-label="Favori">
              {isFav ? <Heart className="w-5 h-5" /> : <HeartOff className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{p.type}</Badge>
            <Badge variant="secondary">Zones {p.zone[0]}–{p.zone[1]}</Badge>
            {p.sun.map(s => <Badge key={s}>{prettySun(s)}</Badge>)}
            {p.colors.slice(0,3).map(c => <Badge key={c} variant="outline">{c}</Badge>)}
            {p.native && <Badge className="bg-emerald-100 text-emerald-700">Natif</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="mr-4">Haut. ~{p.height} cm</span>
            <span>Largeur ~{p.spread} cm</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.nurseries.map((n, i) => <NurseryChip key={n.name+i} n={n} />)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Filters({ filters, setFilters, total, onReset }) {
  const fileRef = useRef(null);
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <SectionTitle icon={Filter} title="Filtres" subtitle={`${total} plante${total>1?"s":""} trouvée${total>1?"s":""}`} />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Zone (min)</label>
            <Select value={filters.zoneMin ?? ""} onValueChange={(v)=>setFilters(f=>({...f, zoneMin: v?Number(v):undefined}))}>
              <SelectTrigger><SelectValue placeholder="min" /></SelectTrigger>
              <SelectContent>{ZONES.map(z=>(<SelectItem key={z} value={z}>{z}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Zone (max)</label>
            <Select value={filters.zoneMax ?? ""} onValueChange={(v)=>setFilters(f=>({...f, zoneMax: v?Number(v):undefined}))}>
              <SelectTrigger><SelectValue placeholder="max" /></SelectTrigger>
              <SelectContent>{ZONES.map(z=>(<SelectItem key={z} value={z}>{z}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={filters.type || ""} onValueChange={(v)=>setFilters(f=>({...f, type: v || undefined}))}>
              <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Tous</SelectItem>
                {TYPES.map(t=>(<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Sol</label>
            <Select value={filters.soil || ""} onValueChange={(v)=>setFilters(f=>({...f, soil: v || undefined}))}>
              <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Tous</SelectItem>
                {SOILS.map(s=>(<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Ensoleillement</label>
            <Select value={filters.sun || ""} onValueChange={(v)=>setFilters(f=>({...f, sun: v || undefined}))}>
              <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Tous</SelectItem>
                {SUNS.map(s=>(<SelectItem key={s} value={s}>{prettySun(s)}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Couleur</label>
            <Select value={filters.color || ""} onValueChange={(v)=>setFilters(f=>({...f, color: v || undefined}))}>
              <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Toutes</SelectItem>
                {COLORS.map(c=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Floraison</label>
            <Select value={filters.bloom || ""} onValueChange={(v)=>setFilters(f=>({...f, bloom: v || undefined}))}>
              <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Toutes</SelectItem>
                {BLOOMS.map(b=>(<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Mot-clé</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
              <Input className="pl-8" placeholder="nom commun, latin..." value={filters.q || ""} onChange={(e)=>setFilters(f=>({...f, q: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={!!filters.native} onCheckedChange={(v)=>setFilters(f=>({...f, native: v || undefined}))} id="native" />
            <label htmlFor="native" className="text-sm">Espèce indigène (Québec)</label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button variant="secondary" onClick={onReset}><Settings2 className="w-4 h-4 mr-1"/>Réinitialiser</Button>
          <Button variant="outline" onClick={()=>downloadCSV("resultats-plantes.csv", filters.__exportRows || [])}><Download className="w-4 h-4 mr-1"/>Exporter CSV</Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={async (e)=>{
            const file = e.target.files?.[0];
            if (!file) return;
            const rows = await readCSV(file);
            filters.__onImport && filters.__onImport(rows);
            e.currentTarget.value = ""; // reset
          }} />
          <Button variant="outline" onClick={()=>fileRef.current?.click()}><Upload className="w-4 h-4 mr-1"/>Importer CSV</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// -----------------------------
// Composant principal
// -----------------------------
export default function QuebecPlantFinder() {
    const [favorites, setFavorites] = useState(() => new Set()); //JSON.parse(localStorage.getItem("qpf_favs") || "[]")));
    const [filters, setFilters] = useState({ q: "", zoneMin: undefined, zoneMax: undefined, type: undefined, soil: undefined, sun: undefined, color: undefined, bloom: undefined, native: undefined });
    const [dark, setDark] = useState(false);

    const [allPlants, setAllPlants] = useState(() => {
      const saved = undefined; //localStorage.getItem("qpf_plants");
      return saved ? JSON.parse(saved) : STARTER_PLANTS;
    });

  useEffect(()=>{ localStorage.setItem("qpf_plants", JSON.stringify(allPlants)); }, [allPlants]);
  useEffect(()=>{ localStorage.setItem("qpf_favs", JSON.stringify(Array.from(favorites))); }, [favorites]);

  const toggleFav = (id) => setFavorites(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const resetFilters = () => setFilters({ q: "", zoneMin: undefined, zoneMax: undefined, type: undefined, soil: undefined, sun: undefined, color: undefined, bloom: undefined, native: undefined });

  const filtered = useMemo(() => {
    return allPlants.filter(p => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!(p.name.toLowerCase().includes(q) || p.latin.toLowerCase().includes(q))) return false;
      }
      if (filters.type && p.type !== filters.type) return false;
      if (filters.soil && !p.soil.includes(filters.soil)) return false;
      if (filters.sun && !p.sun.includes(filters.sun)) return false;
      if (filters.color && !p.colors.includes(filters.color)) return false;
      if (filters.bloom && !p.bloom.includes(filters.bloom)) return false;
      if (filters.native && !p.native) return false;
      if (filters.zoneMin && p.zone[1] < filters.zoneMin) return false;
      if (filters.zoneMax && p.zone[0] > filters.zoneMax) return false;
      return true;
    });
  }, [allPlants, filters]);

  // exposer les lignes pour export CSV
  const exportRows = filtered.map(p => ({
    id: p.id,
    nom: p.name,
    latin: p.latin,
    type: p.type,
    zone_min: p.zone[0],
    zone_max: p.zone[1],
    sol: p.soil.join("|"),
    soleil: p.sun.join("|"),
    couleurs: p.colors.join("|"),
    floraison: p.bloom.join("|"),
    natif: p.native ? "oui" : "non",
    hauteur_cm: p.height,
    largeur_cm: p.spread,
    pepinieres: p.nurseries.map(n=>`${n.name} (${n.city})`).join(" | "),
  }));

  // hack: passer des callbacks dans l'objet filters (pour import)
  const filtersWithHelpers = useMemo(() => ({
    ...filters,
    __exportRows: exportRows,
    __onImport: (rows) => {
      // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
      const toPlant = (r, i) => {
        const cleanup = (x) => typeof x === "string" ? x.trim() : x;
        const arr = (x) => typeof x === "string" ? x.split("|").map(s=>s.trim()).filter(Boolean) : [];
        /** @type {Plant} */
        const p = {
          id: String(r.id || `import-${Date.now()}-${i}`),
          name: cleanup(r.nom) || `Plante importée ${i+1}`,
          latin: cleanup(r.latin) || "",
          type: /** @type any */(cleanup(r.type) || "vivace"),
          zone: [Number(r.zone_min)||3, Number(r.zone_max)||6],
          soil: /** @type any */(arr(r.sol)),
          sun: /** @type any */(arr(r.soleil)),
          colors: arr(r.couleurs),
          bloom: /** @type any */(arr(r.floraison)),
          native: (String(r.natif||"").toLowerCase().startsWith("o")),
          height: Number(r.hauteur_cm)||50,
          spread: Number(r.largeur_cm)||40,
          nurseries: NURSERIES.slice(0,1),
        };
        return p;
      };
      setAllPlants(prev => [...prev, ...rows.map(toPlant)]);
    }
  }), [filters, exportRows]);

  return (
    <div className={`min-h-screen ${dark?"dark":''}`}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-7 h-7" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Québec Plant Finder</h1>
              <p className="text-sm text-muted-foreground">Trouvez des plantes adaptées à votre site et voyez où les acheter</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={()=>setDark(d=>!d)} aria-label="Basculer thème">
              {dark ? <Sun className="w-4 h-4 mr-1"/> : <Moon className="w-4 h-4 mr-1"/>}
              {dark ? "Clair" : "Sombre"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Filters filters={filtersWithHelpers} setFilters={setFilters} total={filtered.length} onReset={resetFilters} />
            <Card className="rounded-2xl mt-6">
              <CardHeader>
                <SectionTitle icon={Heart} title="Favoris" subtitle={`${favorites.size} sélection${favorites.size>1?'s':''}`} />
              </CardHeader>
              <CardContent>
                {favorites.size === 0 ? (
                  <p className="text-sm text-muted-foreground">Ajoutez des plantes en cliquant sur le cœur dans les fiches.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(favorites).map(id => {
                      const p = allPlants.find(x=>x.id===id);
                      if (!p) return null;
                      return (
                        <Badge key={id} className="cursor-pointer" onClick={()=>setFilters(f=>({...f, q: p.name }))}>{p.name}</Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl mt-6">
              <CardHeader>
                <SectionTitle icon={ExternalLink} title="Astuces & Intégration" />
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Remplacez <code>STARTER_PLANTS</code> par vos données (CSV → Import).</li>
                  <li>Back-end suggéré: Supabase/Firestore + fonctions de recherche (Postgres FTS).</li>
                  <li>Pour la dispo en pépinière, exposez un petit API JSON par pépinière (stock, ville, URL).</li>
                  <li>Ajoutez des champs: humidité, pH, sel routier, tolérance chevreuils, etc.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="rounded-2xl mb-4">
              <CardHeader className="pb-3">
                <SectionTitle icon={Search} title="Résultats" subtitle="Fiches filtrées ci-dessous" />
              </CardHeader>
            </Card>
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {filtered.map(p => (
                  <PlantCard key={p.id} p={p} onToggleFav={toggleFav} isFav={favorites.has(p.id)} />
                ))}
                {filtered.length === 0 && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-muted-foreground">
                    Aucune plante ne correspond. Essayez d'élargir les filtres.
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-10 text-xs text-muted-foreground text-center">
          <p>MVP sans serveur – pour démonstration. © {new Date().getFullYear()} Québec Plant Finder</p>
        </footer>
      </div>

      {/* Styles utilitaires pour le mode sombre si l'app n'a pas de provider */}
      <style>{`
        .dark { color-scheme: dark; }
      `}</style>
    </div>
  );
}

/* ---------------------------------
   TODO – Architecture conseillée
   ---------------------------------
   Données
   - Table plants (id, name, latin, type, zone_min, zone_max, soil[], sun[], colors[], bloom[], native, height_cm, spread_cm, ...)
   - Table nurseries (id, name, city, website)
   - Table stock (plant_id, nursery_id, status[in|low|out], price, updated_at)

   API (exemples)
   - GET /plants?zoneMin=4&zoneMax=5&soil=sableux&sun=plein-soleil&color=orange&native=1&q=asclepias
   - GET /plants/:id
   - GET /plants/:id/availability → liste des pépinières + stock
   - POST /ingest/csv (protégé) → importer des lots depuis fichiers fournisseurs

   Fonctionnalités à venir
   - Multi-sélection pour sol / soleil / couleurs
   - Carte des pépinières (MapLibre/Leaflet)
   - Pagination & tri (hauteur, nom, zone)
   - Auth pour pépinières (MAJ de leurs stocks)
   - Internationalisation FR/EN
*/
export function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
