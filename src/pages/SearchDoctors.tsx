import { useState } from "react";
import { mockDoctors, specializations, locations } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Briefcase, Eye, Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchDoctors() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("all");
  const [loc, setLoc] = useState("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = mockDoctors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === "all" || d.specialization === spec;
    const matchLoc = loc === "all" || d.location === loc;
    return matchSearch && matchSpec && matchLoc;
  });

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold">Find a Doctor</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Search verified healthcare professionals</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border bg-card p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger className="w-full sm:w-44 h-10 text-sm"><SelectValue placeholder="Specialization" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={loc} onValueChange={setLoc}>
            <SelectTrigger className="w-full sm:w-40 h-10 text-sm"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${search}-${spec}-${loc}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-xl border bg-card overflow-hidden card-hover"
            >
              {/* Header with avatar */}
              <div className="p-4 pb-0">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                    {doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                    <p className="text-xs text-primary font-medium">{doc.specialization}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{doc.rating}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSave(doc.id)}
                    className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${saved.has(doc.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  </motion.button>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 pt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{doc.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  <span>{doc.experience} years experience</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1" asChild>
                    <Link to={`/doctor/${doc.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90" asChild>
                    <Link to={`/contact/${doc.id}`}>Contact</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No doctors found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
