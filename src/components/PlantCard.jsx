import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Leaf, Heart, HeartOff, ExternalLink, Download, Upload, Sun, Moon, MapPin, Settings2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const prettySun = (s) => ({ "plein-soleil": "Plein soleil", "mi-ombre": "Mi-ombre", "ombre": "Ombre" }[s] || s);

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

export const PlantCard = ({ p, onToggleFav, isFav }) => (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg leading-tight">{p.name}</CardTitle>
                        <p className="text-sm italic text-muted-foreground">{p.latin}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{p.type}</Badge>
                    <Badge variant="secondary">Zones {p.zone[0]}–{p.zone[1]}</Badge>
                    {p.sun.map(s => <Badge key={s}>{prettySun(s)}</Badge>)}
                    {p.colors.slice(0, 3).map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                    {p.native && <Badge className="bg-emerald-100 text-emerald-700">Natif</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                    <span className="mr-4">Haut. ~{p.height} cm</span>
                    <span>Largeur ~{p.spread} cm</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {p.nurseries.map((n, i) => <NurseryChip key={n.name + i} n={n} />)}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);
