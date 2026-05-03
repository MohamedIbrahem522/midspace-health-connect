import { useState } from "react";
import { mockDoctors, specializations, locations } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Briefcase, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function SearchDoctors() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("all");
  const [loc, setLoc] = useState("all");

  const filtered = mockDoctors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === "all" || d.specialization === spec;
    const matchLoc = loc === "all" || d.location === loc;
    return matchSearch && matchSpec && matchLoc;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Find a Doctor</h1>
      <p className="mt-1 text-muted-foreground">Search verified healthcare professionals</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Specialization" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={loc} onValueChange={setLoc}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="rounded-2xl border bg-card p-6 card-shadow transition-shadow hover:card-shadow-hover">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                {doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">{doc.specialization}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {doc.location}</div>
              <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {doc.experience} years</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {doc.rating}/5.0</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                <Link to={`/doctor/${doc.id}`}><Eye className="h-4 w-4" /> View</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to={`/contact/${doc.id}`}>Contact</Link>
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">No doctors found.</div>}
      </div>
    </div>
  );
}
